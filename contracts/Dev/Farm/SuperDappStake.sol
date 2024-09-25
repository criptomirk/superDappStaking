// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Inspired by https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol
contract SuperDappStake is Pausable, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */
    IERC20 public sDappToken;
    uint256 public periodFinish;
    uint256 public rewardRate;
    uint256 public constant rewardsDuration = 30 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 private _totalSupply;
    uint256 public stakeLimit;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) private _balances;

    /* ========== EVENTS ========== */
    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event Recovered(address token, uint256 amount);
    event Compounded(address indexed user, uint256 reward);
    event StakeLimitUpdated(uint256 newLimit);

    /* ========== MODIFIERS ========== */
    /**
     * @notice Update pool state when call mutative functions
     * @param beneficiary The account to check
     */
    modifier updateReward(address beneficiary) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (beneficiary != address(0)) {
            rewards[beneficiary] = earned(beneficiary);
            userRewardPerTokenPaid[beneficiary] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== CONSTRUCTOR ========== */
    /**
     * @param _sDappToken Address of the SuperDapp token
     * @param _stakeLimit Initial stake limit
     */
    constructor(address _sDappToken, uint256 _stakeLimit) Ownable(msg.sender) {
        sDappToken = IERC20(_sDappToken);
        stakeLimit = _stakeLimit;
    }

    /* ========== VIEWS ========== */
    /**
     * @notice Returns the total amount of staked tokens
     */
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @notice Returns the total amount of tokens staked in the Farm
     * @param beneficiary The account to check
     */
    function balanceOf(address beneficiary) external view returns (uint256) {
        return _balances[beneficiary];
    }

    /**
     * @notice Returns the latest timestamp of applicable reward
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
     * @notice Retunrs the reward rate in range of timestamp based on totalSupply
     */
    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((lastTimeRewardApplicable() - lastUpdateTime) *
                rewardRate *
                1e18) / _totalSupply);
    }

    /**
     * @notice Returns the earned amount of an address
     * @param beneficiary The account to check
     */
    function earned(address beneficiary) public view returns (uint256) {
        return
            ((_balances[beneficiary] *
                (rewardPerToken() - userRewardPerTokenPaid[beneficiary])) /
                1e18) + rewards[beneficiary];
    }

    /**
     * @notice Returns the total number of tokens being distributed
     */
    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * rewardsDuration;
    }

    /**
     * @notice Returns the number of remaining tokens to be distributed
     */
    function getRemainingTotalReward() external view returns (uint256) {
        if (periodFinish >= block.timestamp) {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            return leftover;
        } else {
            return 0;
        }
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    /**
     * @notice User can stake token by this function when not paused
     * @notice Amount to be staked cannot be higher than stakeLimit
     * @param amount Number of tokens to be staked
     */
    function stake(
        uint256 amount
    ) external nonReentrant whenNotPaused updateReward(_msgSender()) {
        require(amount > 0, "SuperDappStake::CANNOT_STAKE_ZERO");
        require(
            _totalSupply + amount <= stakeLimit,
            "SuperDappStake::STAKE_LIMIT_EXCEEDED"
        );
        _totalSupply += amount;
        _balances[_msgSender()] += amount;
        sDappToken.safeTransferFrom(_msgSender(), address(this), amount);
        emit Staked(_msgSender(), amount);
    }

    /**
     * @notice User can withdraw token by this function
     * @param amount Number of tokens to be withdrawn
     */
    function withdraw(
        uint256 amount
    ) public nonReentrant updateReward(_msgSender()) {
        require(amount > 0, "SuperDappStake::CANNOT_WITHDRAW_ZERO");
        require(
            _balances[_msgSender()] >= amount,
            "SuperDappStake::INSUFFICIENT_TOKEN_AMOUNT"
        );
        _totalSupply -= amount;
        _balances[_msgSender()] -= amount;
        sDappToken.safeTransfer(_msgSender(), amount);
        emit Withdrawn(_msgSender(), amount);
    }

    /**
     * @notice User can get the reward by this function
     */
    function getReward() public nonReentrant updateReward(_msgSender()) {
        uint256 reward = rewards[_msgSender()];
        if (reward > 0) {
            rewards[_msgSender()] = 0;
            sDappToken.safeTransfer(_msgSender(), reward);
            emit RewardPaid(_msgSender(), reward);
        }
    }

    /**
     * @notice User can compound your rewards into the pool
     */
    function compound()
        public
        whenNotPaused
        nonReentrant
        updateReward(_msgSender())
    {
        uint256 reward = earned(_msgSender());
        require(reward > 0, "SuperDappStake::ZERO_REWARD_AMOUNT");
        require(
            _totalSupply + reward <= stakeLimit,
            "SuperDappStake::STAKE_LIMIT_EXCEEDED"
        );
        rewards[_msgSender()] = 0;
        _totalSupply += reward;
        _balances[_msgSender()] += reward;
        emit Compounded(_msgSender(), reward);
    }

    /**
     * @notice User can withdraw and get reward at the same time by this function
     */
    function exit() external {
        withdraw(_balances[_msgSender()]);
        getReward();
    }

    /* ========== RESTRICTED FUNCTIONS ========== */
    /**
     * @notice Owner should call it function after send tokens to the contract.
     * @param reward Number of tokens that will be distributed
     */
    function notifyRewardAmount(
        uint256 reward
    ) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward / rewardsDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / rewardsDuration;
        }

        /* 
        Ensure the provided reward amount is not more than the balance in the contract.
        This keeps the reward rate in the right range, preventing overflows due to
        very high values of rewardRate in the earned and rewardsPerToken functions;
        Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        */
        uint256 balance = sDappToken.balanceOf(address(this)) - _totalSupply;
        require(
            rewardRate <= balance / rewardsDuration,
            "SuperDappStake::PROVIDED_REWARD_TOO_HIGH"
        );

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + rewardsDuration;
        emit RewardAdded(reward);
    }

    /**
     * @notice Owner can recover ERC20 tokens sent to the contract by this function
     * @param tokenAddress Token address to be withdrawn
     * @param tokenAmount Number of tokens to be withdrawn
     */
    function recoverERC20(
        address tokenAddress,
        uint256 tokenAmount
    ) external onlyOwner {
        require(
            tokenAddress != address(sDappToken),
            "SuperDappStake::CANNOT_WITHDRAW_STAKING_TOKEN"
        );
        IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    /**
     * @notice Owner can update the stake limit
     * @param newLimit The new stake limit
     */
    function updateStakeLimit(uint256 newLimit) external onlyOwner {
        stakeLimit = newLimit;
        emit StakeLimitUpdated(newLimit);
    }
}
