// /* eslint-disable node/no-missing-import */
// /* eslint-disable no-unused-vars */
// import { expect } from "chai";
// import hre from "hardhat";
// import { DevGroupMembership, DevSuperDapp, IERC20 } from "../../typechain";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// // eslint-disable-next-line no-unused-vars
// async function calculateExpectedFinalBalance(
//   groupId: string,
//   tokenId: string,
//   totalAmount: ethers.BigNumber,
//   initialBalance: ethers.BigNumber,
//   groupMembership: ethers.BigNumber
// ) {
//   const treasuryFee = totalAmount.mul(2).div(100);
//   const subjectFee = totalAmount.mul(4).div(100);
//   const originalBondPrice = totalAmount.sub(treasuryFee).sub(subjectFee);
//   const originalBondDiscount = originalBondPrice.mul(20).div(100);

//   const groupProfit = originalBondPrice.mul(40).div(100);
//   const group = await groupMembership.groups(groupId);

//   const originalSumGroupBondValue =
//     await groupMembership.originalSumGroupBondValues(tokenId);
//   const currentSumGroupBondValues = ethers.BigNumber.from(
//     group.sumGroupBondValues
//   );

//   const bondValueChange = currentSumGroupBondValues.sub(
//     originalSumGroupBondValue
//   );

//   const profitShare = groupProfit
//     .mul(bondValueChange)
//     .div(currentSumGroupBondValues);
//   const currentBlock = await ethers.provider.getBlock("latest");
//   const currentBlockTimestamp = BigNumber.from(currentBlock.timestamp);

//   const avgGroupAge = currentBlockTimestamp.sub(
//     group.sumGroupTimestamp.div(group.supply)
//   );

//   let timeBonus = BigNumber.from(0);
//   if (avgGroupAge.gte(365 * 24 * 60 * 60)) {
//     timeBonus = originalBondPrice.mul(10).div(100);
//   } else if (avgGroupAge.gte(180 * 24 * 60 * 60)) {
//     timeBonus = originalBondPrice.mul(5).div(100);
//   } else if (avgGroupAge.gte(30 * 24 * 60 * 60)) {
//     timeBonus = originalBondPrice.mul(2).div(100);
//   }
//   const expectedFinalBalance = initialBalance
//     .sub(originalBondDiscount)
//     .sub(treasuryFee)
//     .sub(subjectFee)
//     .add(profitShare)
//     .add(timeBonus);
//   return expectedFinalBalance;
// }

// const _mainConfigSimulation = {
//   simple: {
//     createGroupMinimumJoinAmount: ethers.utils.parseEther("10"), // 10 tokens
//     createGroupGroupId: 1,
//     createGroupGroupType: 1,
//     timeBonuses: {
//       [3600 * 4]: 10, // 10% for 4 hours
//       [3600 * 24]: 20, // 20% for 24 hours
//       [3600 * 24 * 7]: 30, // 30% for 7 days
//     },
//   },
// };

// describe("app::complex", async function () {
//   // @ts-ignore
//   let [
//     owner,
//     user1,
//     user2,
//     user3,
//     user4,
//     user5,
//     user6,
//     user7,
//     user8,
//     user9,
//   ]: SignerWithAddress[] = await ethers.getSigners();

//   let token: IERC20;
//   let superDapp: DevSuperDapp;
//   let group: DevGroupMembership;

//   before(async function () {
//     [owner, user1, user2, user3, user4, user5, user6, user7, user8, user9] =
//       await ethers.getSigners();

//     const DevSuperDappToken = await ethers.getContractFactory(
//       "DevSuperDappToken"
//     );
//     token = await DevSuperDappToken.deploy();

//     const DevSuperDapp = await ethers.getContractFactory("DevSuperDapp");
//     superDapp = await DevSuperDapp.deploy(owner.address, token.address);

//     const groupMembershipAddress = await superDapp.groupMembership();
//     const DevGroupMembership = await ethers.getContractFactory(
//       "DevGroupMembership"
//     );
//     group = DevGroupMembership.attach(groupMembershipAddress);
//   });

//   it("contracts deployed", async () => {
//     expect(group.address != null).is.true;
//     expect(superDapp.address != null).is.true;
//     expect(token.address != null).is.true;
//   });

//   // ... (continue with other tests)
// });
