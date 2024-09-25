// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {SafeMath} from "./lib/SafeMath.sol";
import {TokenIdsUtils} from "./lib/TokenIdsUtils.sol";

contract GroupMembership is Initializable, ERC721Upgradeable {
    using SafeMath for uint256;
    enum GroupType {
        ANNOUNCEMENT,
        SOCIAL
    }

    struct GroupTimeBonus {
        uint256 time; // avg time in hours
        uint256 bonus; // bonus in percent
    }

    struct DappSettingSnapshot {
        uint256 protocolFeePercent;
        uint256 subjectFeePercent;
    }

    struct Group {
        uint32 supply;
        uint32 index;
        bool locked;
        GroupType groupType;
        uint256 sumGroupBondValues;
        uint256 sumGroupTimestamp;
        address creator;
        uint256 minimumJoinAmount;
        uint256 groupFeeAmount;
        uint256 originalBondValueMultiplier;
    }

    event GroupCreated(
        uint256 indexed groupId,
        address indexed creator,
        uint256 minimumJoinAmount,
        GroupType groupType
    );
    event GroupJoined(
        uint256 indexed groupId,
        address indexed member,
        uint256 groupFee,
        uint256 tokenId
    );
    event GroupLeft(uint256 indexed groupId, address member);
    event GroupLocked(uint256 indexed groupId);
    event GroupOwnershipChanged(
        uint256 indexed groupId,
        address oldOwner,
        address newOwner
    );
    event GroupMiminumJoinAmountChanged(
        uint256 indexed groupId,
        uint256 from,
        uint256 to
    );

    mapping(uint256 => Group) public groups;
    mapping(uint256 => DappSettingSnapshot) public dappSettingSnapshot;
    mapping(uint256 => uint256) public originalGroupBondValues;
    mapping(uint256 => uint256) public originalSumGroupBondValues;
    mapping(uint256 => uint256) public joinTimestamps;

    mapping(uint256 => uint256[]) public groupTimeBonusesKeys; // key is group id , value is array of time in hours
    mapping(uint256 => mapping(uint256 => uint256)) public groupTimeBonuses; // key is gte than N hours

    address public dappAddress;

    modifier onlyFromSuperDapp() {
        require(
            msg.sender == dappAddress,
            "Only SuperDapp can call this function"
        );
        _;
    }

    function initialize() external initializer {
        __ERC721_init("GroupMembership", "GM");
        dappAddress = address(0);
    }

    function setDappAddress(address _dappAddress) external {
        require(dappAddress == address(0), "Dapp address already set");
        dappAddress = _dappAddress;
    }

    function createGroup(
        uint256 minimumJoinAmount,
        uint256 groupId,
        GroupType _type,
        address creator,
        uint256 originalBondValueMultiplier,
        uint256 groupFeeAmount,
        DappSettingSnapshot memory _dappSettingSnapshot
    ) external onlyFromSuperDapp {
        require(!groupExists(groupId), "Group already exists");
        Group storage newGroup = groups[groupId];
        newGroup.creator = creator;
        newGroup.minimumJoinAmount = minimumJoinAmount;
        newGroup.groupType = _type;
        newGroup.originalBondValueMultiplier = originalBondValueMultiplier;
        newGroup.groupFeeAmount = groupFeeAmount;
        dappSettingSnapshot[groupId] = _dappSettingSnapshot;
        emit GroupCreated(groupId, creator, minimumJoinAmount, _type);
    }

    function joinGroup(
        uint256 groupId,
        uint256 originalBondPrice,
        uint256 bondPriceMinusFee,
        address owner
    ) external onlyFromSuperDapp returns (uint256) {
        Group storage group = groups[groupId];
        require(
            originalBondPrice >= group.minimumJoinAmount,
            "Insufficient group payment"
        );

        group.supply += 1;
        group.index += 1;
        group.sumGroupBondValues = group.sumGroupBondValues.add(
            bondPriceMinusFee
        );
        group.sumGroupTimestamp = group.sumGroupTimestamp.add(block.timestamp);

        // Add the tokenIndex to the masked groupId
        uint256 tokenId = TokenIdsUtils.combineGroupAndTokenID(
            groupId,
            group.index
        );

        _safeMint(owner, tokenId);

        originalSumGroupBondValues[tokenId] = group.sumGroupBondValues;
        originalGroupBondValues[tokenId] = bondPriceMinusFee;
        joinTimestamps[tokenId] = block.timestamp;
        emit GroupJoined(groupId, owner, bondPriceMinusFee, tokenId);
        return tokenId;
    }

    function calculateProfit(
        uint256 tokenId,
        uint256 currentSumGroupBondValues,
        uint256 sumGroupTimestamp,
        uint256 supply
    ) internal view returns (uint256) {
        uint256 groupId = TokenIdsUtils.getGroupIdFromCombined(tokenId);
        Group storage group = groups[groupId];
        uint256 originalSumGroupBondValue = originalSumGroupBondValues[tokenId];
        uint256 originalBondValue = originalGroupBondValues[tokenId];
        // uint256 groupFee = originalBondValue.mul(40).div(100);
        uint256 groupFee = originalBondValue.mul(group.groupFeeAmount).div(100);
        uint256 groupMultiplier = originalBondValue
            .mul(group.originalBondValueMultiplier)
            .div(100);

        // Calculate the change in total fees since the member joined
        uint256 bondValueChange = 0;
        if (currentSumGroupBondValues > originalSumGroupBondValue) {
            bondValueChange = currentSumGroupBondValues.sub(
                originalSumGroupBondValue
            );
        }
        uint256 profitShare = groupFee.mul(bondValueChange).div(
            currentSumGroupBondValues
        );
        if (profitShare > currentSumGroupBondValues) {
            profitShare = currentSumGroupBondValues;
        }
        uint256 avgGroupAge = block.timestamp.sub(
            sumGroupTimestamp.div(supply)
        );

        uint256 profitWithTimeBonus = calculateTimeBonus(
            groupId,
            originalBondValue,
            avgGroupAge
        );

        return groupMultiplier.add(profitWithTimeBonus).add(profitShare);
    }

    function leaveGroup(
        uint256 groupId,
        uint256 tokenId,
        address owner
    ) external onlyFromSuperDapp returns (uint256, uint256, uint256) {
        require(
            ownerOf(tokenId) == owner,
            "You are not a member of this group"
        );
        Group storage group = groups[groupId];

        uint256 returnAmount = calculateProfit(
            tokenId,
            group.sumGroupBondValues,
            group.sumGroupTimestamp,
            group.supply
        );

        uint256 maxPossibleReturnAmount = returnAmount;

        if (returnAmount > group.sumGroupBondValues) {
            maxPossibleReturnAmount = group.sumGroupBondValues;
        }

        _burn(tokenId);
        group.sumGroupTimestamp = group.sumGroupTimestamp.sub(
            joinTimestamps[tokenId]
        );

        group.supply -= 1;
        group.sumGroupBondValues = group.sumGroupBondValues.sub(returnAmount);

        delete originalGroupBondValues[tokenId];
        delete joinTimestamps[tokenId];
        delete originalSumGroupBondValues[tokenId];

        emit GroupLeft(groupId, owner);
        if (group.supply == 0) {
            uint256 supply = group.sumGroupBondValues;
            group.sumGroupBondValues = 0;
            return (returnAmount, supply, maxPossibleReturnAmount);
        } else {
            return (returnAmount, 0, maxPossibleReturnAmount);
        }
    }

    function groupExists(uint256 groupId) public view returns (bool) {
        return groups[groupId].creator != address(0);
    }

    function groupMembershipExists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getGroupCreator(uint256 groupId) external view returns (address) {
        return groups[groupId].creator;
    }

    function groupLocked(uint256 groupId) external view returns (bool) {
        return groups[groupId].locked;
    }

    function getGroupSettingSnapshot(
        uint256 groupId
    ) external view returns (DappSettingSnapshot memory) {
        return dappSettingSnapshot[groupId];
    }

    function groupBonuses(
        uint256 groupId
    ) external view returns (uint256[] memory) {
        return groupTimeBonusesKeys[groupId];
    }

    function groupBonus(
        uint256 groupId,
        uint256 time
    ) external view returns (uint256) {
        return groupTimeBonuses[groupId][time];
    }

    function calculateTimeBonus(
        uint256 groupId,
        uint256 originalBondValue,
        uint256 avgGroupAge
    ) internal view returns (uint256) {
        uint256 timeBonus = 0;

        uint256 groupTimeBonus = groupTimeBonuses[groupId][0];
        uint256[] memory bonusesKeys = groupTimeBonusesKeys[groupId];

        uint256 ageToHours = avgGroupAge.div(1 hours);

        for (uint256 i = 0; i < bonusesKeys.length; i++) {
            uint256 key = bonusesKeys[i];
            if (ageToHours >= key) {
                groupTimeBonus = groupTimeBonuses[groupId][key];
            }
        }

        timeBonus = originalBondValue.mul(groupTimeBonus).div(100);

        return timeBonus;
    }

    function setMinimumJoinAmount(
        uint256 groupId,
        uint256 minimumJoinAmount,
        address sender
    ) external onlyFromSuperDapp returns (uint256, uint256) {
        Group storage group = groups[groupId];
        require(
            group.creator == sender,
            "Only group creator can set minimum join amount"
        );

        uint256 from = group.minimumJoinAmount;

        group.minimumJoinAmount = minimumJoinAmount;

        emit GroupMiminumJoinAmountChanged(groupId, from, minimumJoinAmount);

        return (from, minimumJoinAmount);
    }

    /**
     * Lock group, used for initial setup of group time bonuses
     * @dev Only group creator can lock group
     */
    function lockGroup(
        uint256 groupId,
        address sender
    ) external onlyFromSuperDapp {
        Group storage group = groups[groupId];
        require(group.creator == sender, "Only group creator can lock group");
        require(!group.locked, "Group is already locked");
        group.locked = true;
        emit GroupLocked(groupId);
    }

    /**
     * Add time bonus to group, used for initial setup of group time bonuses
     * @param groupId ID of the group
     * @param time time in hours or days (1 hour to 365 days)
     * @param bonus bonus in percent (1 to 100)
     */
    function addTimeBonus(
        uint256 groupId,
        uint256 time,
        uint256 bonus,
        address sender
    ) external onlyFromSuperDapp {
        Group storage group = groups[groupId];
        require(group.creator != address(0), "Group does not exist");
        require(
            group.creator == sender,
            "Only group creator can add time bonus"
        );
        require(!group.locked, "Group is locked");

        require(groupTimeBonusesKeys[groupId].length <= 10, "Max 10 bonuses");

        require(
            time > 0 && time <= 365 days,
            "Time must be between 1 hour and 365 days"
        );

        groupTimeBonuses[groupId][time] = bonus;
        groupTimeBonusesKeys[groupId].push(time);
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    function transferOwnership(uint256 groupId, address newOwner) external {
        require(newOwner != address(0), "New owner is the zero address");
        require(groupExists(groupId), "Group does not exist");

        Group storage group = groups[groupId];
        require(
            group.creator == msg.sender,
            "Only group creator can change ownership"
        );
        require(newOwner != group.creator, "New owner is the group creator");

        group.creator = newOwner;

        emit GroupOwnershipChanged(groupId, msg.sender, newOwner);
    }
}
