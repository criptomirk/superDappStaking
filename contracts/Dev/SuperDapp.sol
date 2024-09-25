// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GroupMembership.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "./lib/SafeMath.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {TokenIdsUtils} from "./lib/TokenIdsUtils.sol";

contract SuperDapp is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public protocolFeePercent;
    uint256 public subjectFeePercent;

    uint256 public groupIndex;

    address public treasuryAddress;

    IERC20 public suprToken;
    mapping(address => uint256) public mapDeposits;
    GroupMembership public groupMembership;
    address public groupMembershipAddress;
    mapping(address => uint256) public totalBuyAmount;
    mapping(address => uint256) public totalSellAmount;
    mapping(uint256 => uint256) public tokenInitialPrices; // tokenId => initialPrice

    event BoughtShares(
        address indexed buyer,
        uint256 indexed groupId,
        uint256 tokenId,
        uint256 amount
    );
    event SoldShares(
        address indexed seller,
        uint256 indexed groupId,
        uint256 tokenId,
        uint256 amount
    );
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Transfer(
        address indexed fromAccount,
        address indexed toAccount,
        uint256 amount
    );

    event GroupMiminumJoinAmountChanged(
        uint256 indexed groupId,
        uint256 from,
        uint256 to
    );

    function initialize(
        address _treasuryAddress,
        address _suprToken,
        address _groupMembershipAddress
    ) external initializer {
        require(_suprToken != address(0), "SUPR: Invalid address");
        require(_groupMembershipAddress != address(0), "GM: Invalid address");

        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        require(_treasuryAddress != address(0), "T: Invalid address");
        groupMembershipAddress = _groupMembershipAddress;
        groupMembership = GroupMembership(_groupMembershipAddress);
        treasuryAddress = _treasuryAddress;
        suprToken = IERC20(_suprToken);

        protocolFeePercent = 2;
        subjectFeePercent = 4;
        groupIndex = 0;
    }

    function balanceOf(address account) public view returns (uint256) {
        return mapDeposits[account];
    }

    function groupOwner(uint256 _groupIndex) public view returns (address) {
        return groupMembership.getGroupCreator(_groupIndex);
    }

    function calculateGroupIndex(
        uint256 prevGroup,
        uint256 timestamp,
        uint256 blockNumber
    ) public pure returns (uint256) {
        return TokenIdsUtils.createGroupId(prevGroup, blockNumber, timestamp);
    }

    function createGroup(
        uint256 minimumJoinAmount,
        GroupMembership.GroupType groupType
    ) external {
        uint256 groupId = calculateGroupIndex(
            groupIndex,
            block.timestamp,
            block.number
        );

        groupIndex = groupId;

        groupMembership.createGroup(
            minimumJoinAmount,
            groupId,
            groupType,
            msg.sender,
            86, // originalBondValueMultiplier = 86%
            40, // groupFeeAmount = 40%
            GroupMembership.DappSettingSnapshot(
                protocolFeePercent,
                subjectFeePercent
            )
        );

        if (groupType == GroupMembership.GroupType.ANNOUNCEMENT) {
            addGroupTimeBonus(groupId, 1, 2);
            addGroupTimeBonus(groupId, 2, 5);
            addGroupTimeBonus(groupId, 4, 10);
        } else if (groupType == GroupMembership.GroupType.SOCIAL) {
            addGroupTimeBonus(groupId, 30 * 24, 2);
            addGroupTimeBonus(groupId, 180 * 24, 5);
            addGroupTimeBonus(groupId, 365 * 24, 10);
        }

        lockGroup(groupId);
    }

    function lockGroup(uint256 groupId) public {
        groupMembership.lockGroup(groupId, msg.sender);
    }

    function addGroupTimeBonus(
        uint256 groupId,
        uint256 time,
        uint256 bonus
    ) public {
        groupMembership.addTimeBonus(groupId, time, bonus, msg.sender);
    }

    function createGroupWithoutPreset(
        uint256 minimumJoinAmount,
        GroupMembership.GroupType groupType,
        uint256 originalBondValueMultiplier,
        uint256 groupFeeAmount
    ) external {
        uint256 groupId = calculateGroupIndex(
            groupIndex,
            block.timestamp,
            block.number
        );

        groupIndex = groupId;

        groupMembership.createGroup(
            minimumJoinAmount,
            groupId,
            groupType,
            msg.sender,
            originalBondValueMultiplier,
            groupFeeAmount,
            GroupMembership.DappSettingSnapshot(
                protocolFeePercent,
                subjectFeePercent
            )
        );
    }

    function getGroupTimeBonuses(
        uint256 groupId
    ) external view returns (uint256[] memory) {
        return groupMembership.groupBonuses(groupId);
    }

    function getGroupTimeBonus(
        uint256 groupId,
        uint256 time
    ) external view returns (uint256) {
        return groupMembership.groupBonus(groupId, time);
    }

    function setProtocolFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent >= 0 && _feePercent <= 100, "Invalid fee percent");

        protocolFeePercent = _feePercent;
    }

    function setSubjectFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent >= 0 && _feePercent <= 100, "Invalid fee percent");

        subjectFeePercent = _feePercent;
    }

    function setTreasuryAddress(address newTreasuryAddress) external onlyOwner {
        require(newTreasuryAddress != address(0), "Invalid address");
        treasuryAddress = newTreasuryAddress;
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");

        suprToken.safeTransferFrom(msg.sender, address(this), amount);

        mapDeposits[msg.sender] = mapDeposits[msg.sender].add(amount);

        emit Deposit(msg.sender, amount);
    }

    function transfer(address toAddress, uint256 amount) external {
        require(toAddress != address(0), "Invalid address");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(msg.sender != toAddress, "Cannot transfer to self");
        require(mapDeposits[msg.sender] >= amount, "Insufficient funds");
        mapDeposits[msg.sender] = mapDeposits[msg.sender].sub(amount);
        mapDeposits[toAddress] = mapDeposits[toAddress].add(amount);
        emit Transfer(msg.sender, toAddress, amount);
    }

    function withdraw() external nonReentrant {
        uint256 amount = mapDeposits[msg.sender];
        require(amount > 0, "No deposit exists");
        delete mapDeposits[msg.sender];

        suprToken.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    function buyShares(
        uint256 groupId,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(groupMembership.groupExists(groupId), "Group does not exist");

        require(amount > 0, "Amount must be greater than 0");

        require(
            mapDeposits[msg.sender] >= amount,
            "Insufficient funds to buy shares"
        );

        GroupMembership.DappSettingSnapshot memory settings = groupMembership
            .getGroupSettingSnapshot(groupId);

        uint256 treasuryFee = amount.mul(settings.protocolFeePercent).div(100);
        uint256 subjectFee = amount.mul(settings.subjectFeePercent).div(100);
        uint256 tokenId = groupMembership.joinGroup(
            groupId,
            amount,
            amount.sub(treasuryFee).sub(subjectFee),
            msg.sender
        );

        address creator = groupMembership.getGroupCreator(groupId);
        mapDeposits[msg.sender] = mapDeposits[msg.sender].sub(amount);
        mapDeposits[treasuryAddress] = mapDeposits[treasuryAddress].add(
            treasuryFee
        );
        mapDeposits[creator] = mapDeposits[creator].add(subjectFee);
        totalBuyAmount[msg.sender] = totalBuyAmount[msg.sender].add(amount);
        tokenInitialPrices[tokenId] = amount;
        emit BoughtShares(msg.sender, groupId, tokenId, amount);

        return tokenId;
    }

    function sellMultipleShares(
        uint256[] memory tokenId
    ) external returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        require(tokenId.length > 0, "Token ID array is empty");
        require(
            tokenId.length <= 10,
            "Cannot sell more than 10 tokens at once"
        );

        uint256[] memory returnAmounts = new uint256[](tokenId.length);
        uint256[] memory burnAmounts = new uint256[](tokenId.length);
        uint256[] memory maxPossibleReturnAmounts = new uint256[](
            tokenId.length
        );
        for (uint256 i = 0; i < tokenId.length; i++) {
            (
                returnAmounts[i],
                burnAmounts[i],
                maxPossibleReturnAmounts[i]
            ) = sellShares(tokenId[i]);
        }
        return (returnAmounts, burnAmounts, maxPossibleReturnAmounts);
    }

    function sellShares(
        uint256 tokenId
    ) public nonReentrant returns (uint256, uint256, uint256) {
        uint256 groupId = TokenIdsUtils.getGroupIdFromCombined(tokenId);

        require(groupMembership.groupExists(groupId), "Group does not exist");
        require(
            groupMembership.groupMembershipExists(tokenId),
            "Group membership does not exist"
        );
        (
            uint256 returnAmount,
            uint256 burnAmount,
            uint256 maxPossibleReturnAmount
        ) = groupMembership.leaveGroup(groupId, tokenId, msg.sender);
        if (burnAmount > 0) {
            address deadAddress = 0x000000000000000000000000000000000000dEaD;
            mapDeposits[deadAddress] = mapDeposits[deadAddress].add(burnAmount);
        }
        mapDeposits[msg.sender] = mapDeposits[msg.sender].add(
            maxPossibleReturnAmount
        );
        totalSellAmount[msg.sender] = totalSellAmount[msg.sender].add(
            maxPossibleReturnAmount
        );
        emit SoldShares(msg.sender, groupId, tokenId, maxPossibleReturnAmount);

        return (returnAmount, burnAmount, maxPossibleReturnAmount);
    }

    function setMinimumJoinAmountForGroup(
        uint256 groupId,
        uint256 minimumJoinAmount
    ) external returns (uint256, uint256) {
        require(groupMembership.groupExists(groupId), "Group does not exist");

        require(
            groupMembership.getGroupCreator(groupId) == msg.sender,
            "Only group owner can change minimum join amount"
        );

        require(
            minimumJoinAmount > 0,
            "Minimum join amount must be greater than 0"
        );

        (uint256 from, uint256 to) = groupMembership.setMinimumJoinAmount(
            groupId,
            minimumJoinAmount,
            msg.sender
        );

        emit GroupMiminumJoinAmountChanged(groupId, from, to);

        return (from, to);
    }
}
