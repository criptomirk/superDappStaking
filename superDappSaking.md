# SuperDappStake

## Deployment & Settings
- **Owner Address**: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- **sDappToken**: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- **Period Finish**: 0n
- **Reward Rate**: 0n
- **Rewards Duration**: 2592000n
- **Last Update Time**: 0n
- **Reward Per Token Stored**: 0n
- **_Total Supply**: 0n
- **Stake Limit**: 50000.0

✔ 

## Rewards Set Up
✔ Only owner can call `notifyRewardAmount`
- **Deposited Reward**: 100.0
- **_Total Supply**: 0n
- **Owner Address**: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- **sDappToken**: 0x0165878A594ca255338adfa4d48449f69242Eb8F
- **Period Finish**: 1729936947n
- **Reward Rate**: 38580246913580n
- **Rewards Duration**: 2592000n
- **Last Update Time**: 1727344947n
- **Reward Per Token Stored**: 0n
- **_Total Supply**: 0n
- **Stake Limit**: 50000.0

✔ Should set up reward correctly using `notifyRewardAmount` (44ms)

## stake()
- **Initial Staking Balance**: 0.0
- **Post Staking Balance**: 100.0
- **Initial Token Balance**: 100.0
- **Post Token Balance**: 0.0

✔ Staking increases staking balance  
✔ Cannot stake 0  
✔ Cannot stake over limit  
✔ Should change stake limit and stake over previous limit  
- **Initial Staking Balance**: 0.0  
- **Post Staking Balance**: 100.0  
- **Initial Token Balance**: 100.0  
- **Post Token Balance**: 0.0  

### ----------Before Set Up------------
- **Period Finish**: 0n  
- **Reward Rate**: 0n  
- **Last Update Time**: 0n  
- **Reward Per Token Stored**: 0n  
- **_Total Supply**: 100.0  
- **Stake Limit**: 50000.0  

### ----------After Set Up------------
- **Period Finish**: 1729936976n  
- **Reward Rate**: 38580246913580n  
- **Last Update Time**: 1727344976n  
- **Reward Per Token Stored**: 0n  
- **_Total Supply**: 100.0  
- **Stake Limit**: 50000.0  

✔ Set reward after some staking (67ms)

## Stake() && Withdraw() && GetReward()
- **Account 1 Initial Staking Balance**: 0.0
- **Account 1 Post Staking Balance**: 100.0
- **Account 1 Initial Token Balance**: 100.0
- **Account 1 Post Token Balance**: 0.0
- **Account 2 Initial Staking Balance**: 0.0
- **Account 2 Post Staking Balance**: 100.0
- **Account 2 Initial Token Balance**: 100.0
- **Account 2 Post Token Balance**: 0.0
- **Account 3 Initial Staking Balance**: 0.0
- **Account 3 Post Staking Balance**: 100.0
- **Account 3 Initial Token Balance**: 100.0
- **Account 3 Post Token Balance**: 0.0
- **Account 4 Initial Staking Balance**: 0.0
- **Account 4 Post Staking Balance**: 100.0
- **Account 4 Initial Token Balance**: 100.0
- **Account 4 Post Token Balance**: 0.0
- **Account 5 Initial Staking Balance**: 0.0
- **Account 5 Post Staking Balance**: 100.0
- **Account 5 Initial Token Balance**: 100.0
- **Account 5 Post Token Balance**: 0.0
- **Account 1 Post Withdraw Token Balance**: 166.6691550925925114
- **Account 1 Earned Rewards**: 66.6691550925925114
- **Account 2 Post Withdraw Token Balance**: 166.6681905864196718
- **Account 2 Earned Rewards**: 66.6681905864196718
- **Account 3 Post Withdraw Token Balance**: 166.6678690843620585
- **Account 3 Earned Rewards**: 66.6678690843620585
- **Account 4 Post Withdraw Token Balance**: 166.6678690843620585
- **Account 4 Earned Rewards**: 66.6678690843620585
- **Account 5 Post Withdraw Token Balance**: 166.6683513374484783
- **Account 5 Earned Rewards**: 66.6683513374484783

✔ Staking, withdraw, get rewards (189ms)

## Stake() && Exit()
- **Account 1 Initial Staking Balance**: 0.0
- **Account 1 Post Staking Balance**: 100.0
- **Account 1 Initial Token Balance**: 100.0
- **Account 1 Post Token Balance**: 0.0
- **Account 2 Initial Staking Balance**: 0.0
- **Account 2 Post Staking Balance**: 100.0
- **Account 2 Initial Token Balance**: 100.0
- **Account 2 Post Token Balance**: 0.0
- **Account 3 Initial Staking Balance**: 0.0
- **Account 3 Post Staking Balance**: 100.0
- **Account 3 Initial Token Balance**: 100.0
- **Account 3 Post Token Balance**: 0.0
- **Account 4 Initial Staking Balance**: 0.0
- **Account 4 Post Staking Balance**: 100.0
- **Account 4 Initial Token Balance**: 100.0
- **Account 4 Post Token Balance**: 0.0
- **Account 5 Initial Staking Balance**: 0.0
- **Account 5 Post Staking Balance**: 100.0
- **Account 5 Initial Token Balance**: 100.0
- **Account 5 Post Token Balance**: 0.0
- **Account 1 Post Withdraw Token Balance**: 166.6691550925925114
- **Account 1 Earned Rewards**: 66.6690779320986843
- **Account 2 Post Withdraw Token Balance**: 166.6680941358023879
- **Account 2 Earned Rewards**: 66.667997685185104
- **Account 3 Post Withdraw Token Balance**: 166.6676440329217294
- **Account 3 Earned Rewards**: 66.6675154320986842
- **Account 4 Post Withdraw Token Balance**: 166.6674511316871615
- **Account 4 Earned Rewards**: 66.6672582304525936
- **Account 5 Post Withdraw Token Balance**: 166.6675475823044455
- **Account 5 Earned Rewards**: 66.6671617798353097

✔ Staking, exit (166ms)

## Stake() && Compound() && Exit()
- **Account 1 Initial Staking Balance**: 0.0
- **Account 1 Post Staking Balance**: 100.0
- **Account 1 Initial Token Balance**: 100.0
- **Account 1 Post Token Balance**: 0.0
- **Account 2 Initial Staking Balance**: 0.0
- **Account 2 Post Staking Balance**: 100.0
- **Account 2 Initial Token Balance**: 100.0
- **Account 2 Post Token Balance**: 0.0
- **Account 3 Initial Staking Balance**: 0.0
- **Account 3 Post Staking Balance**: 100.0
- **Account 3 Initial Token Balance**: 100.0
- **Account 3 Post Token Balance**: 0.0
- **Account 4 Initial Staking Balance**: 0.0
- **Account 4 Post Staking Balance**: 100.0
- **Account 4 Initial Token Balance**: 100.0
- **Account 4 Post Token Balance**: 0.0
- **Account 5 Initial Staking Balance**: 0.0
- **Account 5 Post Staking Balance**: 100.0
- **Account 5 Initial Token Balance**: 100.0
- **Account 5 Post Token Balance**: 0.0
- **Account 1 Post Withdraw Token Balance**: 166.6691550925925114
- **Account 1 Earned Rewards**: 66.6690779320986843
- **Account 2 Post Withdraw Token Balance**: 166.6680941358023879
- **Account 2 Earned Rewards**: 66.667997685185104
- **Account 3 Post Withdraw Token Balance**: 166.6676440329217294
- **Account 3 Earned Rewards**: 66.6675154320986842
- **Account 4 Compounded Earned Rewards**: 66.6672582304525936
- **Account 5 Compounded Earned Rewards**: 66.6671617798353097
- **Account 4 Final Withdraw Token Balance**: 333.334624164507405327
- **Account 4 Final Earned Rewards after Compounding**: 166.666980131501951581
- **Account 5 Final Withdraw Token Balance**: 333.334479487755400747
- **Account 5 Final Earned Rewards after Compounding**: 166.666787229950627676

✔ Staking, exit, and compounding for accounts 4 and 5 (154ms)

## Compounding Rewards Exploit Prevention
- **Initial Earned Rewards**: 4999999.99999999999824
- **Earned After First Compound**: 0.0
- **Earned Before Second Compound**: 166666.666666666664914634
- **Final Staked Balance after Compounding**: 5166768.595679012343478733 tokens

✔ Should prevent disproportionate balance increase by compounding frequently (43ms)

## lastTimeRewardApplicable()
✔ Should return 0 when updated  
✔ Should equal current timestamp  

## rewardPerToken()
✔ Should return 0  
✔ Should be greater than 0  

## External Rewards Recovery
✔ Should revert if recovering staking token  
✔ Should retrieve external token from sDappStake and reduce contract balance  
✔ Should retrieve external token from sDappStake and increase owner’s balance  
✔ Should emit Recovered event  

**20 passing (13s)**
