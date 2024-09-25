// const BN = require("bn.js");
// class Group {
//   constructor(
//     supply,
//     index,
//     sumGroupBondValues,
//     sumGroupTimestamp,
//     creator,
//     minimumJoinAmount,
//     groupFeeAmount,
//     originalBondValueMultiplier,
//     groupTimeBonusesKeys,
//     dappSettingSnapshot,
//     groupTimeBonuses,
//     originalGroupBondValues,
//     originalSumGroupBondValues,
//     joinTimestamps,
//   ) {
//     this.supply = supply;
//     this.index = index;
//     this.sumGroupBondValues = sumGroupBondValues;
//     this.sumGroupTimestamp = sumGroupTimestamp;
//     this.creator = creator;
//     this.minimumJoinAmount = minimumJoinAmount;
//     this.groupFeeAmount = groupFeeAmount;
//     this.originalBondValueMultiplier = originalBondValueMultiplier;
//     this.groupTimeBonusesKeys = groupTimeBonusesKeys;
//     this.dappSettingSnapshot = dappSettingSnapshot;
//     this.groupTimeBonuses = groupTimeBonuses;
//   }

//   calculateProfit(
//     blockTimestamp
//   ) {
//     let originalSumGroupBondValue = this.originalSumGroupBondValues;
//     let originalBondValue = this.originalGroupBondValues;

//     let groupFee = originalBondValue * this.groupFeeAmount / 100;

//     let bondValueChange = 0;
//     if (this.sumGroupBondValues > originalSumGroupBondValue) {
//       bondValueChange = this.sumGroupBondValues - originalSumGroupBondValue;
//     }


//     let profitShare = this.groupFee * bondValueChange / this.sumGroupBondValues;
//     if (profitShare > currentSumGroupBondValues) {
//       profitShare = currentSumGroupBondValues;
//     }

//     let avgGroupAge = blockTimestamp / (this.sumGroupTimestamp / this.supply);

//     let timeBonus = this.calculateTimeBonus();

//     let profit = profitShare + timeBonus;

//     return profit;
//   }

//   calculateTimeBonus(groupAge) {
//     let timeBonus = 0;
//     let timeBonusKeys = this.groupTimeBonusesKeys;
//     let groupTimeBonuses = this.groupTimeBonuses;
//     let groupTimeBonusesKeysLength = timeBonusKeys.length;


//     let groupTimeBonus = groupTimeBonuses[timeBonusKeys[0]];

//     for (let i = 0; i < groupTimeBonusesKeysLength; i++) {
//       let key = timeBonusKeys[i];
//       let timeBonus = groupTimeBonuses[key];
//       if (groupAge < key) {
//         break;
//       }
//       groupTimeBonus = timeBonus;
//     }

//     timeBonus = originalBondValue.mul(groupTimeBonus.bonus).div(100);



//     return timeBonus;
//   }

//   async calculateExpectedFinalBalance(tokenId, totalAmount, initialBalance, groupMembership) {
//     const groupId = new BN(this.index);
//     const treasuryFee = new BN(totalAmount)
//       .mul(new BN(this.dappSettingSnapshot.treasuryFee))
//       .div(new BN(100));
//     const subjectFee = new BN(totalAmount)
//       .mul(new BN(this.dappSettingSnapshot.subjectFee))
//       .div(new BN(100));
//     const originalBondPrice = new BN(totalAmount)
//       .sub(treasuryFee)
//       .sub(subjectFee);
//     const originalBondDiscount = originalBondPrice
//       .mul(new BN(20))
//       .div(new BN(100));

//     const groupProfit = originalBondPrice
//       .mul(new BN(this.groupFeeAmount))
//       .div(new BN(100));
//     const group = await groupMembership.groups(groupId);

//     // Fetch the original and current sum of group fees based on tokenId
//     const originalSumGroupBondValue = await groupMembership.originalSumGroupBondValues(tokenId);

//     const currentSumGroupBondValues = new BN(group.sumGroupBondValues);

//     // Calculate the change in total fees since the member joined
//     const bondValueChange = currentSumGroupBondValues.sub(
//       new BN(originalSumGroupBondValue)
//     );

//     // New formula for profitShare
//     const profitShare = groupProfit
//       .mul(bondValueChange)
//       .div(currentSumGroupBondValues);
//     const currentBlock = await web3.eth.getBlock('latest');
//     const currentBlockTimestamp = currentBlock.timestamp;

//     // Fetch group details to calculate expected final balances
//     const avgGroupAge =
//       currentBlockTimestamp - group.sumGroupTimestamp / group.supply;

//     const groupPlansKeys = await groupMembership.groupBonuses(groupId);

//     const allBonuses = {}; // key is hours and value is bonus %

//     for (let i = 0; i < groupPlansKeys.length; i++) {
//       const key = groupPlansKeys[i];
//       const bonus = await groupMembership.groupBonus(groupId, key);
//       allBonuses[key] = bonus;
//     }


//     const groupTimeBonusesKeys = Object.keys(allBonuses);
//     const groupTimeBonusesKeysLength = groupTimeBonusesKeys.length;

//     let groupTimeBonus = allBonuses[groupTimeBonusesKeys[0]];

//     for (let i = 0; i < groupTimeBonusesKeysLength; i++) {
//       const key = groupTimeBonusesKeys[i];
//       const timeBonus = allBonuses[key];
//       if (avgGroupAge < key) {
//         break;
//       }
//       groupTimeBonus = timeBonus;
//     }

//     let timeBonus = originalBondPrice.mul(new BN(groupTimeBonus)).div(100);

//     const expectedFinalBalance = initialBalance
//       .sub(originalBondDiscount)
//       .sub(treasuryFee)
//       .sub(subjectFee)
//       .add(profitShare)
//       .add(timeBonus);
//     return expectedFinalBalance;
//   }
// }



// module.exports = {
//   Group
// };
