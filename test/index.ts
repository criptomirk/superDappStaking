import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import {
  GroupMembership__factory,
  SuperDappToken__factory,
  SuperDapp__factory,
  SuperDapp,
  SuperDappToken,
  GroupMembership,
} from "../typechain";
import { SuperDappTokenInterface } from "../typechain/SuperDappToken";

import { any } from "hardhat/internal/core/params/argumentTypes";
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { BigNumberish, ContractTransactionReceipt, ContractTransaction, Signer, ContractFactory, BaseContract, Contract, EventLog, LogParams, Log } from "ethers";
import { SuperDappInterface } from "../typechain/SuperDapp";
import exp from "constants";

const intToBn = (num: number) => {
  return ethers.parseEther(num.toString());
}

const eth2Human = (eth: BigNumberish) => {
  return ethers.formatEther(eth);
}

const getEstimatedSellShares = async (bank: SuperDapp, user: Signer, tokenId: string): Promise<{
  returnAmount: BigNumberish,
  feeAmount: BigNumberish,
  realReturn: BigNumberish,
}> => {
  const profitBefore = await bank.connect(user).sellShares.staticCallResult(tokenId);

  return {
    returnAmount: profitBefore[0],
    feeAmount: profitBefore[1],
    realReturn: profitBefore[2],
  };
}

describe("SuperDapp::complexTest", function () {
  let bank: SuperDapp;
  let groupManager: GroupMembership;
  let token: SuperDappToken;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let user4: Signer;
  let user5: Signer;
  let user6: Signer;
  let user7: Signer;
  let user8: Signer;
  let user9: Signer;

  before(async () => {
    const bankFactory: ContractFactory<any, SuperDapp__factory> = await ethers.getContractFactory("SuperDapp") as unknown as ContractFactory<any, SuperDapp__factory>;
    const tokenFactoryRaw: SuperDappToken__factory = await ethers.getContractFactory("SuperDappToken");
    const tokenFactory = tokenFactoryRaw as unknown as ContractFactory<any, SuperDappToken__factory>;
    const gm: ContractFactory<any, GroupMembership__factory> = await ethers.getContractFactory("GroupMembership") as unknown as ContractFactory<any, GroupMembership__factory>;

    [owner, user1, user2, user3, user4, user5, user6, user7, user8, user9] = await hre.ethers.getSigners();

    token = await upgrades.deployProxy(tokenFactory) as unknown as SuperDappToken;

    await token.waitForDeployment();

    const gmProxy = await upgrades.deployProxy(gm) as unknown as GroupMembership;

    await gmProxy.waitForDeployment();

    bank = await upgrades.deployProxy(bankFactory, [
      await owner.getAddress(),
      await token.getAddress(),
      await gmProxy.getAddress(),
    ]) as unknown as SuperDapp;

    await bank.waitForDeployment();

    // console.log("Bank deployed to:", await bank.getAddress());
    // console.log("Token deployed to:", await token.getAddress());
    // console.log("GroupManager deployed to:", await gmProxy.getAddress());

    groupManager = gmProxy as GroupMembership;
    await groupManager.setDappAddress(await bank.getAddress());
  });

  it("should deploy contracts correctly", async () => {
    expect(await bank.getAddress()).to.not.equal(0);
    expect(await token.getAddress()).to.not.equal(0);
    expect(await groupManager.getAddress()).to.not.equal(0);

    expect(await bank.owner()).to.equal(await owner.getAddress());
    expect(await bank.groupMembership()).to.equal(await groupManager.getAddress());
    expect(await bank.suprToken()).to.equal(await token.getAddress());
  });

  it("should have correct initial values", async () => {
    expect(await token.name()).to.equal("SuperDapp");
    expect(await token.symbol()).to.equal("SUPR");
    expect(await token.decimals()).to.equal(18);
    expect(await token.totalSupply()).to.equal(ethers.parseEther("1000000000"));

    expect(await bank.protocolFeePercent()).to.equal(2);
    expect(await bank.subjectFeePercent()).to.equal(4);


  });




  describe("test::mainFlow", async () => {
    before(async () => {
      await token.transfer(await user1.getAddress(), intToBn(100));
      await token.transfer(await user2.getAddress(), intToBn(100));
      await token.transfer(await user3.getAddress(), intToBn(100));
      await token.transfer(await user4.getAddress(), intToBn(100));
      await token.transfer(await user5.getAddress(), intToBn(100));
      await token.transfer(await user6.getAddress(), intToBn(100));
      await token.transfer(await user7.getAddress(), intToBn(100));
      await token.transfer(await user8.getAddress(), intToBn(100));
      await token.transfer(await user9.getAddress(), intToBn(100));

      await token.connect(user1).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user2).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user3).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user4).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user5).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user6).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user7).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user8).approve(await bank.getAddress(), intToBn(100));
      await token.connect(user9).approve(await bank.getAddress(), intToBn(100));


      await bank.connect(user1).deposit(intToBn(100));
      await bank.connect(user2).deposit(intToBn(100));
      await bank.connect(user3).deposit(intToBn(100));
      await bank.connect(user4).deposit(intToBn(100));
      await bank.connect(user5).deposit(intToBn(100));
      await bank.connect(user6).deposit(intToBn(100));
      await bank.connect(user7).deposit(intToBn(100));
      await bank.connect(user8).deposit(intToBn(100));
      await bank.connect(user9).deposit(intToBn(100));
    });


    describe("test::changeGroupMinJoinAmount", async () => {
      let _testGroupId: number;
      let _initialJoinAmount = intToBn(1); // 1 token
      let _newJoinAmount = intToBn(5); // 5 tokens

      before(async () => {
        const createGroupTx = await bank.connect(user1).createGroup(
          _initialJoinAmount,
          0
        );
        await createGroupTx.wait();

        _testGroupId = (await bank.groupIndex()).toString();
      })

      it("try to join group with less amount than required", async () => {
        await expect(bank.connect(user9).buyShares(_testGroupId, intToBn(0.5))).to.be.revertedWith("Insufficient group payment");
      });

      it("ensure user can join group with required amount", async () => {
        await expect(bank.connect(user9).buyShares(_testGroupId, _initialJoinAmount)).to.be.not.reverted;
      });

      it("other user can not change min join amount", async () => {
        await expect(bank.connect(user2).setMinimumJoinAmountForGroup(_testGroupId, _newJoinAmount)).to.be.revertedWith("Only group owner can change minimum join amount");
      });

      describe("test::changeGroupMinJoinAmount", async () => {
        before(async () => {
          expect(await bank.connect(user1).setMinimumJoinAmountForGroup(_testGroupId, _newJoinAmount))
            .to.emit(bank, "GroupMinJoinAmountChanged");

        });

        it("ensure user can't join group with old amount", async () => {
          await expect(bank.connect(user9).buyShares(_testGroupId, _initialJoinAmount)).to.be.revertedWith("Insufficient group payment");
        });

        it("ensure user can join group with new amount", async () => {
          await expect(bank.connect(user9).buyShares(_testGroupId, _newJoinAmount)).to.be.not.reverted;
        });
      });
    });


    it("ensure main flow setup correctly", async () => {

      [user1, user2, user3, user4, user5, user6, user7, user8, user9].forEach(async (user) => {
        expect(await token.balanceOf(await user.getAddress())).to.equal(100);
      });
    });

    describe("test::createGroupWithBasicConfig", async () => {
      let gidSocial: string
      let gidAnnounce: string

      before(async () => {
        await bank.connect(user1).createGroup(
          ethers.parseEther("1"),
          0
        );

        gidSocial = (await bank.groupIndex()).toString();

        await bank.connect(user1).createGroup(
          ethers.parseEther("1"),
          1
        );

        gidAnnounce = (await bank.groupIndex()).toString();
      });

      it("ensure group owner is user 1", async () => {
        expect(await bank.groupOwner(gidSocial)).to.equal(await user1.getAddress());
        expect(await bank.groupOwner(gidAnnounce)).to.equal(await user1.getAddress());
      });

      it("ensure both groups locked", async () => {
        expect(await groupManager.groupLocked(gidSocial)).to.equal(true);
        expect(await groupManager.groupLocked(gidAnnounce)).to.equal(true);
      });


      it("ensure announcement group has correct bonuses", async () => {
        const bonusesHours = await groupManager.groupBonuses(gidAnnounce);

        const oneday = 3600 * 24;

        expect(bonusesHours.length).to.equal(3);
        expect(bonusesHours[0]).to.equal(BigInt(oneday * 30));
        expect(bonusesHours[1]).to.equal(BigInt(oneday * 180));
        expect(bonusesHours[2]).to.equal(BigInt(oneday * 365));

        const bonusesPercent = await groupManager.groupBonus(
          gidAnnounce,
          bonusesHours[0],
        );

        expect(bonusesPercent).to.equal(2);

        const bonusesPercent2 = await groupManager.groupBonus(
          gidAnnounce,
          bonusesHours[1],
        );

        expect(bonusesPercent2).to.equal(5);

        const bonusesPercent3 = await groupManager.groupBonus(
          gidAnnounce,
          bonusesHours[2],
        );

        expect(bonusesPercent3).to.equal(10);
      });

      it("ensure social group has correct bonuses", async () => {
        const bonusesHours = await groupManager.groupBonuses(gidSocial);

        expect(bonusesHours.length).to.equal(3);
        expect(bonusesHours[0]).to.equal(3600);
        expect(bonusesHours[1]).to.equal(3600 * 2);
        expect(bonusesHours[2]).to.equal(3600 * 4);

        const bonusesPercent = await groupManager.groupBonus(
          gidSocial,
          bonusesHours[0],
        );

        expect(bonusesPercent).to.equal(2);

        const bonusesPercent2 = await groupManager.groupBonus(
          gidSocial,
          bonusesHours[1],
        );

        expect(bonusesPercent2).to.equal(5);

        const bonusesPercent3 = await groupManager.groupBonus(
          gidSocial,
          bonusesHours[2],
        );

        expect(bonusesPercent3).to.equal(10);
      });
    });

    describe(
      "test::createGroupWithBasicConfig",
      async () => {

        let groupId: string;

        before(async () => {
          await bank.connect(user1).createGroupWithoutPreset(
            ethers.parseEther("1"),
            1,
            80,
            40
          );

          groupId = (await bank.groupIndex()).toString();

          // console.log("Group id:", groupId);

          await bank.connect(user1).addGroupTimeBonus(
            groupId,
            1,
            10,
          );

          await bank.connect(user1).addGroupTimeBonus(
            groupId,
            4,
            25,
          );

          await bank.connect(user1).addGroupTimeBonus(
            groupId,
            12,
            30,
          );

        });

        it("ensure group owner is user 1", async () => {
          expect(await bank.groupOwner(groupId)).to.equal(await user1.getAddress());
        });

        it("ensure group has correct bonuses", async () => {
          const bonusesHours = await groupManager.groupBonuses(groupId);

          expect(bonusesHours.length).to.equal(3);
          expect(bonusesHours[0]).to.equal(1);
          expect(bonusesHours[1]).to.equal(4);

          const bonusesPercent = await groupManager.groupBonus(
            groupId,
            bonusesHours[0],
          );

          expect(bonusesPercent).to.equal(10);

          const bonusesPercent2 = await groupManager.groupBonus(
            groupId,
            bonusesHours[1],
          );

          expect(bonusesPercent2).to.equal(25);

          const bonusesPercent3 = await groupManager.groupBonus(
            groupId,
            12,
          );

          expect(bonusesPercent3).to.equal(30);
        });

        describe("test::groupOwnershipTransferAndWithdrawal", async () => {
          it("ensure user 1 can transfer ownership to user 2", async () => {
            expect(await groupManager.connect(user1).transferOwnership(
              groupId,
              await user2.getAddress(),
            )).to.emit(groupManager, "OwnershipTransferred").withArgs(
              groupId,
              await user1.getAddress(),
              await user2.getAddress(),
            );
            expect(await bank.groupOwner(groupId)).to.equal(await user2.getAddress());
            expect(await bank.groupOwner(groupId)).to.not.equal(await user1.getAddress());

            await expect(groupManager.connect(user1).transferOwnership(
              groupId,
              await user2.getAddress(),
            )).to.be.revertedWith("Only group creator can change ownership");


            // transfer back

            expect(await groupManager.connect(user2).transferOwnership(
              groupId,
              await user1.getAddress(),
            )).to.emit(groupManager, "OwnershipTransferred").withArgs(
              groupId,
              await user2.getAddress(),
              await user1.getAddress(),
            );

            expect(await bank.groupOwner(groupId)).to.equal(await user1.getAddress());
            expect(await bank.groupOwner(groupId)).to.not.equal(await user2.getAddress());
          });
        });

        describe("test::lockGroup", async () => {

          it("ensure group is not locked", async () => {
            expect(await groupManager.groupLocked(groupId)).to.equal(false);
          });

          it("ensure no one can lock group except of owner", async () => {
            await expect(bank.connect(user2).lockGroup(groupId)).to.be.revertedWith("Only group creator can lock group");
          });

          describe("test::afterLock", async () => {
            before(async () => {
              await bank.connect(user1).lockGroup(groupId);
            });

            it("ensure group is locked", async () => {
              expect(await groupManager.groupLocked(groupId)).to.equal(true);

              expect(
                bank.connect(user1).addGroupTimeBonus(
                  groupId,
                  6,
                  25,
                )
              ).to.be.revertedWith("Group is locked");
            });

            it("ensure no one can lock group again", async () => {
              await expect(bank.connect(user1).lockGroup(groupId)).to.be.revertedWith("Group is already locked");
            });


            describe("test::usersStartJoinGroup", async () => {
              it("ensure user 2 can join group", async () => {


                const groupCreatorBalanceBefore = await bank.balanceOf(await user1.getAddress());

                expect(await bank.connect(user2).buyShares(groupId, intToBn(10))).to.emit(bank, "BoughtShares").withArgs(
                  groupId,
                  user2,
                  any,
                  intToBn(10),
                );

                const groupCreatorBalanceAfter = await bank.balanceOf(await user1.getAddress());

                expect(groupCreatorBalanceAfter).gt(groupCreatorBalanceBefore);
              });
            });


            describe("test::userJoinToGroupAndBalancesUpdated", async () => {

              let user2Shares: number;
              let user3Shares: number;
              let user4Shares: number;
              let ownerShares: number;

              before(async () => {
                user2Shares = (await groupManager.balanceOf(await user2.getAddress()));
                user3Shares = (await groupManager.balanceOf(await user3.getAddress()));
                user4Shares = (await groupManager.balanceOf(await user4.getAddress()));
                ownerShares = (await groupManager.balanceOf(await owner.getAddress()));


              });

              it("ensure user 3 can join group and balances updated", async () => {

                user3Shares = (await groupManager.balanceOf(await user3.getAddress()));


                expect(await bank.connect(user3).buyShares(groupId, intToBn(10))).to.emit(bank, "BoughtShares").withArgs(
                  groupId,
                  await user3.getAddress(),
                  any,
                  intToBn(10),
                );

                expect(
                  await groupManager.balanceOf(await user3.getAddress()),
                  "-> user 3 balance should be decreased"
                ).gt(user3Shares);

              });


              it("ensure user 4 can join group and balances updated and leave after some time", async () => {

                user4Shares = (await groupManager.balanceOf(await user4.getAddress()));

                const joinTx: ContractTransaction = await bank.connect(user4).buyShares(groupId, intToBn(10));

                const joinTxReceipt: ContractTransactionReceipt = await joinTx.wait();

                const eventLog: EventLog | Log = joinTxReceipt.logs[2];

                // @ts-ignore
                const newTokenId = eventLog.args.tokenId;

                expect(joinTx).to.emit(bank, "BoughtShares").withArgs(
                  groupId,
                  await user4.getAddress(),
                  newTokenId,
                  intToBn(10),
                );


                expect(
                  (await groupManager.balanceOf(await user4.getAddress())),
                  "-> user 4 shares should be increased"
                ).gt(user4Shares);


                const profitBefore = await getEstimatedSellShares(
                  bank,
                  user4,
                  newTokenId,
                );

                expect(eth2Human(profitBefore.realReturn)).to.equal(eth2Human(intToBn(7.52)));

                await time.increase(time.duration.hours(1)); // add 1 hours

                const profitAfter = await getEstimatedSellShares(
                  bank,
                  user4,
                  newTokenId,
                );

                expect(eth2Human(profitAfter.realReturn)).to.equal(eth2Human(intToBn(8.46)));

                await time.increase(time.duration.hours(4)); // add 1 hours

                const profitAfter2 = await getEstimatedSellShares(
                  bank,
                  user4,
                  newTokenId,
                );
                expect(eth2Human(profitAfter2.realReturn)).to.equal(eth2Human(intToBn(9.87)));


                await time.increase(time.duration.hours(12)); // add 1 hours

                const profitAfter3 = await getEstimatedSellShares(
                  bank,
                  user4,
                  newTokenId,
                );
                expect(eth2Human(profitAfter3.realReturn)).to.equal(eth2Human(intToBn(10.34)));


                await time.increase(time.duration.hours(24)); // add 24 hours

                const profitAfter4 = await getEstimatedSellShares(
                  bank,
                  user4,
                  newTokenId,
                );

                expect(eth2Human(profitAfter4.realReturn)).to.equal(eth2Human(intToBn(10.34))); // ensure there will not be anything added


                /** try withdraw */

                const balanceSnapshotBefore = await bank.balanceOf(await user4.getAddress());

                await expect(bank.connect(user4).sellShares(newTokenId)).to.emit(bank, "SoldShares").withArgs(
                  await user4.getAddress(),
                  groupId,
                  newTokenId,
                  intToBn(10.34),
                );

                await expect(bank.connect(user4).sellShares(newTokenId)).to.be.revertedWith("Group membership does not exist");

                expect(await bank.balanceOf(await user4.getAddress())).to.equal(intToBn(100.34));


              });



              it("ensure user 5 can buy multiple shares and withdraw them all by one tx", async () => {

                const joinTx: ContractTransaction = await bank.connect(user5).buyShares(groupId, intToBn(10));
                const joinTxReceipt: ContractTransactionReceipt = await joinTx.wait();
                const eventLog: EventLog | Log = joinTxReceipt.logs[2];
                // @ts-ignore
                const newTokenId1 = eventLog.args.tokenId;

                expect(await bank.tokenInitialPrices(newTokenId1)).to.equal(intToBn(10));


                const joinTx2 = await bank.connect(user5).buyShares(groupId, intToBn(10));
                const joinTxReceipt2 = await joinTx2.wait();
                const eventLog2 = joinTxReceipt2.logs[2];
                // @ts-ignore
                const newTokenId2 = eventLog2.args.tokenId;

                expect(newTokenId1).to.not.equal(newTokenId2);
                expect(newTokenId1).to.is.not.null;
                expect(newTokenId2).to.is.not.null;


                const exitTx = await bank.connect(user5).sellMultipleShares([newTokenId1, newTokenId2]);

                expect(exitTx).to.emit(bank, "SoldShares").withArgs(
                  await user5.getAddress(),
                  groupId,
                  newTokenId1,
                  intToBn(10.34),
                );

                expect(exitTx).to.emit(bank, "SoldShares").withArgs(
                  await user5.getAddress(),
                  groupId,
                  newTokenId2,
                  intToBn(10.34),
                );

                expect(await groupManager.groupMembershipExists(newTokenId1)).is.false;
                expect(await groupManager.groupMembershipExists(newTokenId2)).is.false;

              });
            })
          });
        });
      }
    );
  });
});
