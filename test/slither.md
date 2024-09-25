INFO:Detectors:
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) has bitwise-xor operator ^ instead of the exponentiation operator **: 
         - inverse = (3 * denominator) ^ 2 (node_modules/@openzeppelin/contracts/utils/math/Math.sol#184)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-exponentiation
INFO:Detectors:
Reentrancy in SuperDappStake.exit() (contracts/Dev/Farm/SuperDappStake.sol#203-206):
        External calls:
        - withdraw(_balances[_msgSender()]) (contracts/Dev/Farm/SuperDappStake.sol#204)
                - returndata = address(token).functionCall(data) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#96)
                - sDappToken.safeTransfer(_msgSender(),amount) (contracts/Dev/Farm/SuperDappStake.sol#163)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - returndata = address(token).functionCall(data) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#96)
                - sDappToken.safeTransfer(_msgSender(),reward) (contracts/Dev/Farm/SuperDappStake.sol#174)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        External calls sending eth:
        - withdraw(_balances[_msgSender()]) (contracts/Dev/Farm/SuperDappStake.sol#204)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        State variables written after the call(s):
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - _status = NOT_ENTERED (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#74)
                - _status = ENTERED (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#68)
        ReentrancyGuard._status (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#37) can be used in cross function reentrancies:
        - ReentrancyGuard._nonReentrantAfter() (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#71-75)
        - ReentrancyGuard._nonReentrantBefore() (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#61-69)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - lastUpdateTime = lastTimeRewardApplicable() (contracts/Dev/Farm/SuperDappStake.sol#43)
        SuperDappStake.lastUpdateTime (contracts/Dev/Farm/SuperDappStake.sol#18) can be used in cross function reentrancies:
        - SuperDappStake.lastUpdateTime (contracts/Dev/Farm/SuperDappStake.sol#18)
        - SuperDappStake.notifyRewardAmount(uint256) (contracts/Dev/Farm/SuperDappStake.sol#213-239)
        - SuperDappStake.rewardPerToken() (contracts/Dev/Farm/SuperDappStake.sol#87-96)
        - SuperDappStake.updateReward(address) (contracts/Dev/Farm/SuperDappStake.sol#41-49)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - rewardPerTokenStored = rewardPerToken() (contracts/Dev/Farm/SuperDappStake.sol#42)
        SuperDappStake.rewardPerTokenStored (contracts/Dev/Farm/SuperDappStake.sol#19) can be used in cross function reentrancies:
        - SuperDappStake.rewardPerToken() (contracts/Dev/Farm/SuperDappStake.sol#87-96)
        - SuperDappStake.rewardPerTokenStored (contracts/Dev/Farm/SuperDappStake.sol#19)
        - SuperDappStake.updateReward(address) (contracts/Dev/Farm/SuperDappStake.sol#41-49)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - rewards[_msgSender()] = 0 (contracts/Dev/Farm/SuperDappStake.sol#173)
                - rewards[beneficiary] = earned(beneficiary) (contracts/Dev/Farm/SuperDappStake.sol#45)
        SuperDappStake.rewards (contracts/Dev/Farm/SuperDappStake.sol#24) can be used in cross function reentrancies:
        - SuperDappStake.earned(address) (contracts/Dev/Farm/SuperDappStake.sol#102-107)
        - SuperDappStake.getReward() (contracts/Dev/Farm/SuperDappStake.sol#170-177)
        - SuperDappStake.rewards (contracts/Dev/Farm/SuperDappStake.sol#24)
        - SuperDappStake.updateReward(address) (contracts/Dev/Farm/SuperDappStake.sol#41-49)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - userRewardPerTokenPaid[beneficiary] = rewardPerTokenStored (contracts/Dev/Farm/SuperDappStake.sol#46)
        SuperDappStake.userRewardPerTokenPaid (contracts/Dev/Farm/SuperDappStake.sol#23) can be used in cross function reentrancies:
        - SuperDappStake.earned(address) (contracts/Dev/Farm/SuperDappStake.sol#102-107)
        - SuperDappStake.updateReward(address) (contracts/Dev/Farm/SuperDappStake.sol#41-49)
        - SuperDappStake.userRewardPerTokenPaid (contracts/Dev/Farm/SuperDappStake.sol#23)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities
INFO:Detectors:
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse = (3 * denominator) ^ 2 (node_modules/@openzeppelin/contracts/utils/math/Math.sol#184)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#188)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#189)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#190)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#191)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#192)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - denominator = denominator / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#169)
        - inverse *= 2 - denominator * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#193)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) performs a multiplication on the result of a division:
        - prod0 = prod0 / twos (node_modules/@openzeppelin/contracts/utils/math/Math.sol#172)
        - result = prod0 * inverse (node_modules/@openzeppelin/contracts/utils/math/Math.sol#199)
GroupMembership.calculateProfit(uint256,uint256,uint256,uint256) (contracts/Dev/GroupMembership.sol#147-187) performs a multiplication on the result of a division:
        - groupFee = originalBondValue.mul(group.groupFeeAmount).div(100) (contracts/Dev/GroupMembership.sol#158)
        - profitShare = groupFee.mul(bondValueChange).div(currentSumGroupBondValues) (contracts/Dev/GroupMembership.sol#170-172)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#divide-before-multiply
INFO:Detectors:
SuperDapp (contracts/Dev/SuperDapp.sol#12-354) has incorrect ERC20 function interface:SuperDapp.transfer(address,uint256) (contracts/Dev/SuperDapp.sol#216-224)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-erc20-interface
INFO:Detectors:
SuperDappStake.rewardPerToken() (contracts/Dev/Farm/SuperDappStake.sol#87-96) uses a dangerous strict equality:
        - _totalSupply == 0 (contracts/Dev/Farm/SuperDappStake.sol#88)
GroupMembership.leaveGroup(uint256,uint256,address) (contracts/Dev/GroupMembership.sol#189-233) uses a dangerous strict equality:
        - group.supply == 0 (contracts/Dev/GroupMembership.sol#226)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-strict-equalities
INFO:Detectors:
Reentrancy in SuperDapp.buyShares(uint256,uint256) (contracts/Dev/SuperDapp.sol#236-272):
        External calls:
        - tokenId = groupMembership.joinGroup(groupId,amount,amount.sub(treasuryFee).sub(subjectFee),msg.sender) (contracts/Dev/SuperDapp.sol#254-259)
        State variables written after the call(s):
        - mapDeposits[msg.sender] = mapDeposits[msg.sender].sub(amount) (contracts/Dev/SuperDapp.sol#262)
        SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28) can be used in cross function reentrancies:
        - SuperDapp.balanceOf(address) (contracts/Dev/SuperDapp.sol#82-84)
        - SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28)
        - SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326)
        - SuperDapp.transfer(address,uint256) (contracts/Dev/SuperDapp.sol#216-224)
        - mapDeposits[treasuryAddress] = mapDeposits[treasuryAddress].add(treasuryFee) (contracts/Dev/SuperDapp.sol#263-265)
        SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28) can be used in cross function reentrancies:
        - SuperDapp.balanceOf(address) (contracts/Dev/SuperDapp.sol#82-84)
        - SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28)
        - SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326)
        - SuperDapp.transfer(address,uint256) (contracts/Dev/SuperDapp.sol#216-224)
        - mapDeposits[creator] = mapDeposits[creator].add(subjectFee) (contracts/Dev/SuperDapp.sol#266)
        SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28) can be used in cross function reentrancies:
        - SuperDapp.balanceOf(address) (contracts/Dev/SuperDapp.sol#82-84)
        - SuperDapp.mapDeposits (contracts/Dev/SuperDapp.sol#28)
        - SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326)
        - SuperDapp.transfer(address,uint256) (contracts/Dev/SuperDapp.sol#216-224)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1
INFO:Detectors:
SuperDapp.setProtocolFeePercent(uint256) (contracts/Dev/SuperDapp.sol#189-193) contains a tautology or contradiction:
        - require(bool,string)(_feePercent >= 0 && _feePercent <= 100,Invalid fee percent) (contracts/Dev/SuperDapp.sol#190)
SuperDapp.setSubjectFeePercent(uint256) (contracts/Dev/SuperDapp.sol#195-199) contains a tautology or contradiction:
        - require(bool,string)(_feePercent >= 0 && _feePercent <= 100,Invalid fee percent) (contracts/Dev/SuperDapp.sol#196)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#tautology-or-contradiction
INFO:Detectors:
SuperDapp.setProtocolFeePercent(uint256) (contracts/Dev/SuperDapp.sol#189-193) should emit an event for: 
        - protocolFeePercent = _feePercent (contracts/Dev/SuperDapp.sol#192) 
SuperDapp.setSubjectFeePercent(uint256) (contracts/Dev/SuperDapp.sol#195-199) should emit an event for: 
        - subjectFeePercent = _feePercent (contracts/Dev/SuperDapp.sol#198) 
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-arithmetic
INFO:Detectors:
GroupMembership.setDappAddress(address)._dappAddress (contracts/Dev/GroupMembership.sol#88) lacks a zero-check on :
                - dappAddress = _dappAddress (contracts/Dev/GroupMembership.sol#90)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation
INFO:Detectors:
SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326) has external calls inside a loop: require(bool,string)(groupMembership.groupExists(groupId),Group does not exist) (contracts/Dev/SuperDapp.sol#303)
SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326) has external calls inside a loop: require(bool,string)(groupMembership.groupMembershipExists(tokenId),Group membership does not exist) (contracts/Dev/SuperDapp.sol#304-307)
SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326) has external calls inside a loop: (returnAmount,burnAmount,maxPossibleReturnAmount) = groupMembership.leaveGroup(groupId,tokenId,msg.sender) (contracts/Dev/SuperDapp.sol#308-312)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation/#calls-inside-a-loop
INFO:Detectors:
Reentrancy in SuperDapp.buyShares(uint256,uint256) (contracts/Dev/SuperDapp.sol#236-272):
        External calls:
        - tokenId = groupMembership.joinGroup(groupId,amount,amount.sub(treasuryFee).sub(subjectFee),msg.sender) (contracts/Dev/SuperDapp.sol#254-259)
        State variables written after the call(s):
        - tokenInitialPrices[tokenId] = amount (contracts/Dev/SuperDapp.sol#268)
        - totalBuyAmount[msg.sender] = totalBuyAmount[msg.sender].add(amount) (contracts/Dev/SuperDapp.sol#267)
Reentrancy in SuperDapp.deposit(uint256) (contracts/Dev/SuperDapp.sol#206-214):
        External calls:
        - suprToken.safeTransferFrom(msg.sender,address(this),amount) (contracts/Dev/SuperDapp.sol#209)
        State variables written after the call(s):
        - mapDeposits[msg.sender] = mapDeposits[msg.sender].add(amount) (contracts/Dev/SuperDapp.sol#211)
Reentrancy in GroupMembership.joinGroup(uint256,uint256,uint256,address) (contracts/Dev/GroupMembership.sol#113-145):
        External calls:
        - _safeMint(owner,tokenId) (contracts/Dev/GroupMembership.sol#138)
                - retval = IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,data) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#496-509)
        State variables written after the call(s):
        - joinTimestamps[tokenId] = block.timestamp (contracts/Dev/GroupMembership.sol#142)
        - originalGroupBondValues[tokenId] = bondPriceMinusFee (contracts/Dev/GroupMembership.sol#141)
        - originalSumGroupBondValues[tokenId] = group.sumGroupBondValues (contracts/Dev/GroupMembership.sol#140)
Reentrancy in SuperDapp.sellShares(uint256) (contracts/Dev/SuperDapp.sol#298-326):
        External calls:
        - (returnAmount,burnAmount,maxPossibleReturnAmount) = groupMembership.leaveGroup(groupId,tokenId,msg.sender) (contracts/Dev/SuperDapp.sol#308-312)
        State variables written after the call(s):
        - mapDeposits[deadAddress] = mapDeposits[deadAddress].add(burnAmount) (contracts/Dev/SuperDapp.sol#315)
        - mapDeposits[msg.sender] = mapDeposits[msg.sender].add(maxPossibleReturnAmount) (contracts/Dev/SuperDapp.sol#317-319)
        - totalSellAmount[msg.sender] = totalSellAmount[msg.sender].add(maxPossibleReturnAmount) (contracts/Dev/SuperDapp.sol#320-322)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2
INFO:Detectors:
Reentrancy in SuperDappStake.exit() (contracts/Dev/Farm/SuperDappStake.sol#203-206):
        External calls:
        - withdraw(_balances[_msgSender()]) (contracts/Dev/Farm/SuperDappStake.sol#204)
                - returndata = address(token).functionCall(data) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#96)
                - sDappToken.safeTransfer(_msgSender(),amount) (contracts/Dev/Farm/SuperDappStake.sol#163)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - returndata = address(token).functionCall(data) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#96)
                - sDappToken.safeTransfer(_msgSender(),reward) (contracts/Dev/Farm/SuperDappStake.sol#174)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        External calls sending eth:
        - withdraw(_balances[_msgSender()]) (contracts/Dev/Farm/SuperDappStake.sol#204)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
        Event emitted after the call(s):
        - RewardPaid(_msgSender(),reward) (contracts/Dev/Farm/SuperDappStake.sol#175)
                - getReward() (contracts/Dev/Farm/SuperDappStake.sol#205)
Reentrancy in GroupMembership.joinGroup(uint256,uint256,uint256,address) (contracts/Dev/GroupMembership.sol#113-145):
        External calls:
        - _safeMint(owner,tokenId) (contracts/Dev/GroupMembership.sol#138)
                - retval = IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,data) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#496-509)
        Event emitted after the call(s):
        - GroupJoined(groupId,owner,bondPriceMinusFee,tokenId) (contracts/Dev/GroupMembership.sol#143)
Reentrancy in SuperDappStake.recoverERC20(address,uint256) (contracts/Dev/Farm/SuperDappStake.sol#246-256):
        External calls:
        - IERC20(tokenAddress).safeTransfer(owner(),tokenAmount) (contracts/Dev/Farm/SuperDappStake.sol#254)
        Event emitted after the call(s):
        - Recovered(tokenAddress,tokenAmount) (contracts/Dev/Farm/SuperDappStake.sol#255)
Reentrancy in SuperDapp.setMinimumJoinAmountForGroup(uint256,uint256) (contracts/Dev/SuperDapp.sol#328-353):
        External calls:
        - (from,to) = groupMembership.setMinimumJoinAmount(groupId,minimumJoinAmount,msg.sender) (contracts/Dev/SuperDapp.sol#344-348)
        Event emitted after the call(s):
        - GroupMiminumJoinAmountChanged(groupId,from,to) (contracts/Dev/SuperDapp.sol#350)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3
INFO:Detectors:
SuperDappStake.lastTimeRewardApplicable() (contracts/Dev/Farm/SuperDappStake.sol#80-82) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp < periodFinish (contracts/Dev/Farm/SuperDappStake.sol#81)
SuperDappStake.rewardPerToken() (contracts/Dev/Farm/SuperDappStake.sol#87-96) uses timestamp for comparisons
        Dangerous comparisons:
        - _totalSupply == 0 (contracts/Dev/Farm/SuperDappStake.sol#88)
SuperDappStake.getRemainingTotalReward() (contracts/Dev/Farm/SuperDappStake.sol#119-127) uses timestamp for comparisons
        Dangerous comparisons:
        - periodFinish >= block.timestamp (contracts/Dev/Farm/SuperDappStake.sol#120)
SuperDappStake.stake(uint256) (contracts/Dev/Farm/SuperDappStake.sol#135-147) uses timestamp for comparisons
        Dangerous comparisons:
        - require(bool,string)(_totalSupply + amount <= stakeLimit,SuperDappStake::STAKE_LIMIT_EXCEEDED) (contracts/Dev/Farm/SuperDappStake.sol#139-142)
SuperDappStake.withdraw(uint256) (contracts/Dev/Farm/SuperDappStake.sol#153-165) uses timestamp for comparisons
        Dangerous comparisons:
        - require(bool,string)(_balances[_msgSender()] >= amount,SuperDappStake::INSUFFICIENT_TOKEN_AMOUNT) (contracts/Dev/Farm/SuperDappStake.sol#157-160)
SuperDappStake.compound() (contracts/Dev/Farm/SuperDappStake.sol#182-198) uses timestamp for comparisons
        Dangerous comparisons:
        - require(bool,string)(reward > 0,SuperDappStake::ZERO_REWARD_AMOUNT) (contracts/Dev/Farm/SuperDappStake.sol#189)
        - require(bool,string)(_totalSupply + reward <= stakeLimit,SuperDappStake::STAKE_LIMIT_EXCEEDED) (contracts/Dev/Farm/SuperDappStake.sol#190-193)
SuperDappStake.notifyRewardAmount(uint256) (contracts/Dev/Farm/SuperDappStake.sol#213-239) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp >= periodFinish (contracts/Dev/Farm/SuperDappStake.sol#216)
        - require(bool,string)(rewardRate <= balance / rewardsDuration,SuperDappStake::PROVIDED_REWARD_TOO_HIGH) (contracts/Dev/Farm/SuperDappStake.sol#231-234)
GroupMembership.joinGroup(uint256,uint256,uint256,address) (contracts/Dev/GroupMembership.sol#113-145) uses timestamp for comparisons
        Dangerous comparisons:
        - require(bool,string)(originalBondPrice >= group.minimumJoinAmount,Insufficient group payment) (contracts/Dev/GroupMembership.sol#120-123)
GroupMembership.calculateProfit(uint256,uint256,uint256,uint256) (contracts/Dev/GroupMembership.sol#147-187) uses timestamp for comparisons
        Dangerous comparisons:
        - currentSumGroupBondValues > originalSumGroupBondValue (contracts/Dev/GroupMembership.sol#165)
        - profitShare > currentSumGroupBondValues (contracts/Dev/GroupMembership.sol#173)
GroupMembership.leaveGroup(uint256,uint256,address) (contracts/Dev/GroupMembership.sol#189-233) uses timestamp for comparisons
        Dangerous comparisons:
        - returnAmount > group.sumGroupBondValues (contracts/Dev/GroupMembership.sol#209)
        - group.supply == 0 (contracts/Dev/GroupMembership.sol#226)
GroupMembership.groupExists(uint256) (contracts/Dev/GroupMembership.sol#235-237) uses timestamp for comparisons
        Dangerous comparisons:
        - groups[groupId].creator != address(0) (contracts/Dev/GroupMembership.sol#236)
GroupMembership.calculateTimeBonus(uint256,uint256,uint256) (contracts/Dev/GroupMembership.sol#270-292) uses timestamp for comparisons
        Dangerous comparisons:
        - ageToHours >= key (contracts/Dev/GroupMembership.sol#284)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp
INFO:Detectors:
OwnableUpgradeable._getOwnableStorage() (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#30-34) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#31-33)
Initializable._getInitializableStorage() (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#223-227) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#224-226)
ERC20Upgradeable._getERC20Storage() (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#51-55) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#52-54)
ERC721Upgradeable._getERC721Storage() (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#44-48) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#45-47)
ERC721Upgradeable._checkOnERC721Received(address,address,uint256,bytes) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#494-511) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#505-507)
ReentrancyGuardUpgradeable._getReentrancyGuardStorage() (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#46-50) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#47-49)
Address._revert(bytes) (node_modules/@openzeppelin/contracts/utils/Address.sol#146-158) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/Address.sol#151-154)
Strings.toString(uint256) (node_modules/@openzeppelin/contracts/utils/Strings.sol#24-44) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/Strings.sol#30-32)
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/Strings.sol#36-38)
Math.mulDiv(uint256,uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/Math.sol#123-202) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/math/Math.sol#130-133)
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/math/Math.sol#154-161)
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/math/Math.sol#167-176)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage
INFO:Detectors:
2 different versions of Solidity are used:
        - Version constraint ^0.8.20 is used by:
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/access/Ownable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#3)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/Address.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/Context.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/Pausable.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/Strings.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/math/Math.sol#4)
                -^0.8.20 (node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol#4)
                -^0.8.20 (contracts/Dev/GroupMembership.sol#2)
                -^0.8.20 (contracts/Dev/SuperDapp.sol#2)
                -^0.8.20 (contracts/Dev/SuperDappToken.sol#2)
                -^0.8.20 (contracts/Dev/lib/SafeMath.sol#2)
                -^0.8.20 (contracts/Dev/lib/TokenIdsUtils.sol#1)
                -^0.8.20 (contracts/Mocks/MockSuperDappToken.sol#2)
        - Version constraint ^0.8.0 is used by:
                -^0.8.0 (contracts/Dev/Farm/SuperDappStake.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used
INFO:Detectors:
GroupMembership._exists(uint256) (contracts/Dev/GroupMembership.sol#360-362) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code
INFO:Detectors:
Version constraint ^0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
        - VerbatimInvalidDeduplication
        - FullInlinerNonExpressionSplitArgumentEvaluationOrder
        - MissingSideEffectsOnSelectorAccess.
It is used by:
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/access/Ownable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#3)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/Address.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/Context.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/Pausable.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/Strings.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/math/Math.sol#4)
        - ^0.8.20 (node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol#4)
        - ^0.8.20 (contracts/Dev/GroupMembership.sol#2)
        - ^0.8.20 (contracts/Dev/SuperDapp.sol#2)
        - ^0.8.20 (contracts/Dev/SuperDappToken.sol#2)
        - ^0.8.20 (contracts/Dev/lib/SafeMath.sol#2)
        - ^0.8.20 (contracts/Dev/lib/TokenIdsUtils.sol#1)
        - ^0.8.20 (contracts/Mocks/MockSuperDappToken.sol#2)
Version constraint ^0.8.0 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
        - FullInlinerNonExpressionSplitArgumentEvaluationOrder
        - MissingSideEffectsOnSelectorAccess
        - AbiReencodingHeadOverflowWithStaticArrayCleanup
        - DirtyBytesArrayToStorage
        - DataLocationChangeInInternalOverride
        - NestedCalldataArrayAbiReencodingSizeValidation
        - SignedImmutables
        - ABIDecodeTwoDimensionalArrayMemory
        - KeccakCaching.
It is used by:
        - ^0.8.0 (contracts/Dev/Farm/SuperDappStake.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity
INFO:Detectors:
Low level call in SafeERC20._callOptionalReturnBool(IERC20,bytes) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#110-117):
        - (success,returndata) = address(token).call(data) (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#115)
Low level call in Address.sendValue(address,uint256) (node_modules/@openzeppelin/contracts/utils/Address.sol#41-50):
        - (success,None) = recipient.call{value: amount}() (node_modules/@openzeppelin/contracts/utils/Address.sol#46)
Low level call in Address.functionCallWithValue(address,bytes,uint256) (node_modules/@openzeppelin/contracts/utils/Address.sol#83-89):
        - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#87)
Low level call in Address.functionStaticCall(address,bytes) (node_modules/@openzeppelin/contracts/utils/Address.sol#95-98):
        - (success,returndata) = target.staticcall(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#96)
Low level call in Address.functionDelegateCall(address,bytes) (node_modules/@openzeppelin/contracts/utils/Address.sol#104-107):
        - (success,returndata) = target.delegatecall(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#105)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls
INFO:Detectors:
Function OwnableUpgradeable.__Ownable_init(address) (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#51-53) is not in mixedCase
Function OwnableUpgradeable.__Ownable_init_unchained(address) (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#55-60) is not in mixedCase
Constant OwnableUpgradeable.OwnableStorageLocation (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#28) is not in UPPER_CASE_WITH_UNDERSCORES
Function ERC20Upgradeable.__ERC20_init(string,string) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#63-65) is not in mixedCase
Function ERC20Upgradeable.__ERC20_init_unchained(string,string) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#67-71) is not in mixedCase
Constant ERC20Upgradeable.ERC20StorageLocation (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#49) is not in UPPER_CASE_WITH_UNDERSCORES
Function ERC721Upgradeable.__ERC721_init(string,string) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#53-55) is not in mixedCase
Function ERC721Upgradeable.__ERC721_init_unchained(string,string) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#57-61) is not in mixedCase
Constant ERC721Upgradeable.ERC721StorageLocation (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#42) is not in UPPER_CASE_WITH_UNDERSCORES
Function ContextUpgradeable.__Context_init() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#18-19) is not in mixedCase
Function ContextUpgradeable.__Context_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#21-22) is not in mixedCase
Function ReentrancyGuardUpgradeable.__ReentrancyGuard_init() (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#57-59) is not in mixedCase
Function ReentrancyGuardUpgradeable.__ReentrancyGuard_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#61-64) is not in mixedCase
Constant ReentrancyGuardUpgradeable.ReentrancyGuardStorageLocation (node_modules/@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol#44) is not in UPPER_CASE_WITH_UNDERSCORES
Function ERC165Upgradeable.__ERC165_init() (node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol#22-23) is not in mixedCase
Function ERC165Upgradeable.__ERC165_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol#25-26) is not in mixedCase
Function IERC20Permit.DOMAIN_SEPARATOR() (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol#89) is not in mixedCase
Parameter GroupMembership.setDappAddress(address)._dappAddress (contracts/Dev/GroupMembership.sol#88) is not in mixedCase
Parameter GroupMembership.createGroup(uint256,uint256,GroupMembership.GroupType,address,uint256,uint256,GroupMembership.DappSettingSnapshot)._type (contracts/Dev/GroupMembership.sol#96) is not in mixedCase
Parameter GroupMembership.createGroup(uint256,uint256,GroupMembership.GroupType,address,uint256,uint256,GroupMembership.DappSettingSnapshot)._dappSettingSnapshot (contracts/Dev/GroupMembership.sol#100) is not in mixedCase
Parameter SuperDapp.initialize(address,address,address)._treasuryAddress (contracts/Dev/SuperDapp.sol#62) is not in mixedCase
Parameter SuperDapp.initialize(address,address,address)._suprToken (contracts/Dev/SuperDapp.sol#63) is not in mixedCase
Parameter SuperDapp.initialize(address,address,address)._groupMembershipAddress (contracts/Dev/SuperDapp.sol#64) is not in mixedCase
Parameter SuperDapp.groupOwner(uint256)._groupIndex (contracts/Dev/SuperDapp.sol#86) is not in mixedCase
Parameter SuperDapp.setProtocolFeePercent(uint256)._feePercent (contracts/Dev/SuperDapp.sol#189) is not in mixedCase
Parameter SuperDapp.setSubjectFeePercent(uint256)._feePercent (contracts/Dev/SuperDapp.sol#195) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
INFO:Detectors:
SuperDappToken.initialize() (contracts/Dev/SuperDappToken.sol#8-11) uses literals with too many digits:
        - _mint(msg.sender,1000000000 * 10 ** decimals()) (contracts/Dev/SuperDappToken.sol#10)
TokenIdsUtils.unpackTokenId(uint256) (contracts/Dev/lib/TokenIdsUtils.sol#27-35) uses literals with too many digits:
        - maskGroupId = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000 (contracts/Dev/lib/TokenIdsUtils.sol#30)
TokenIdsUtils.unpackTokenId(uint256) (contracts/Dev/lib/TokenIdsUtils.sol#27-35) uses literals with too many digits:
        - tokenIdReal = tokenId & 0x00000000000000000000000000000000000000000000000000000000FFFFFFFF (contracts/Dev/lib/TokenIdsUtils.sol#32-33)
MockSuperDappToken.constructor() (contracts/Mocks/MockSuperDappToken.sol#8-10) uses literals with too many digits:
        - _mint(msg.sender,1000000000 * 10 ** decimals()) (contracts/Mocks/MockSuperDappToken.sol#9)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#too-many-digits
INFO:Detectors:
SuperDappStake.sDappToken (contracts/Dev/Farm/SuperDappStake.sol#14) should be immutable 
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#state-variables-that-could-be-declared-immutable
INFO:Slither:. analyzed (34 contracts with 93 detectors), 92 result(s) found