import { expect } from "chai";
import { ethers } from "hardhat";
import { SuperDappToken, sDappStake } from "../../typechain-types";
import { BigNumberish, getBigInt } from "ethers";

describe.only("sDappStake", function () {
  const DAY = 86400;
  const ZERO_BN = ethers.parseUnits("0");

  let signers: any[];
  let sDappStake: sDappStake;
  let deployer: string;
  let sDappToken: SuperDappToken;
  let otherToken: SuperDappToken;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const firstLimit = ethers.parseUnits("50000", 18);

    const tokenFactory = await ethers.getContractFactory("MockSuperDappToken");
    sDappToken = await tokenFactory.deploy();
    await sDappToken.waitForDeployment();

    const otherTokenFactory = await ethers.getContractFactory(
      "MockSuperDappToken"
    );
    otherToken = await otherTokenFactory.deploy();
    await otherToken.waitForDeployment();

    const SDapp = await ethers.getContractFactory("SuperDappStake");
    sDappStake = await SDapp.deploy(sDappToken.getAddress(), firstLimit);
    await sDappStake.waitForDeployment();

    deployer = await sDappStake.owner();
  });

  describe.only("Deployment & Settings", () => {
    it("", async () => {
      console.log("               ownerAddress:", await sDappStake.owner());
      console.log("               sDappToken:", await sDappStake.sDappToken());
      console.log("               periodFinish:", await sDappStake.periodFinish());
      console.log("               rewardRate:", await sDappStake.rewardRate());
      console.log("               rewardsDuration:", await sDappStake.rewardsDuration());
      console.log("               lastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("               rewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("               _totalSupply:", await sDappStake.totalSupply());
      console.log("               stakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));
    });
  });

  describe.only("Rewards set up", () => {
    const rewardValue = ethers.parseUnits("100", 18);
    before(async () => {
      await otherToken.transfer(sDappStake.getAddress(), rewardValue);
    });

    it("only owner can call notifyRewardAmount", async () => {
      await expect(
        sDappStake.connect(signers[1]).notifyRewardAmount(rewardValue)
      )
        .to.be.revertedWithCustomError(sDappStake, "OwnableUnauthorizedAccount")
        .withArgs(await signers[1].getAddress());
    });

    it("Should set up reward correctly using notifyRewardAmount", async () => {
      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);

      console.log("               ownerAddress:", await sDappStake.owner());
      console.log("               sDappToken:", await sDappStake.sDappToken());
      console.log("               periodFinish:", await sDappStake.periodFinish());
      console.log("               rewardRate:", await sDappStake.rewardRate());
      console.log("               rewardsDuration:", await sDappStake.rewardsDuration());
      console.log("               lastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("               rewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("               _totalSupply:", await sDappStake.totalSupply());
      console.log("               stakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));
    });




  });

  // describe("Function permissions", () => {
  //   const rewardValue = ethers.parseUnits("1", 18);

  //   before(async () => {
  //     await otherToken.transfer(sDappStake.getAddress(), rewardValue);
  //   });

  //   it("only owner can call notifyRewardAmount", async () => {
  //     await expect(
  //       sDappStake.connect(signers[1]).notifyRewardAmount(rewardValue)
  //     )
  //       .to.be.revertedWithCustomError(sDappStake, "OwnableUnauthorizedAccount")
  //       .withArgs(await signers[1].getAddress());
  //   });

  //   it("only owner can call recoverERC20", async () => {
  //     await expect(
  //       sDappStake
  //         .connect(signers[1])
  //         .recoverERC20(sDappToken.getAddress(), rewardValue)
  //     )
  //       .to.be.revertedWithCustomError(sDappStake, "OwnableUnauthorizedAccount")
  //       .withArgs(await signers[1].getAddress());
  //   });
  // });

  describe("External Rewards Recovery", () => {
    const amount = ethers.parseUnits("5000", 18);

    beforeEach(async () => {
      await sDappToken.transfer(sDappStake.getAddress(), amount);
      expect(await sDappToken.balanceOf(sDappStake.getAddress())).to.equal(
        amount
      );
    });

    it("should revert if recovering staking token", async () => {
      await expect(
        sDappStake.recoverERC20(sDappToken.getAddress(), amount)
      ).to.be.revertedWith("sDappStake::CANNOT_WITHDRAW_STAKING_TOKEN");
    });

    it("should retrieve external token from sDappStake and reduce contract balance", async () => {
      await otherToken.transfer(sDappStake.getAddress(), amount);

      const balanceBefore: BigNumberish = await otherToken.balanceOf(
        sDappStake.getAddress()
      );

      await sDappStake.recoverERC20(otherToken.getAddress(), amount);
      expect(await otherToken.balanceOf(sDappStake.getAddress())).to.equal(
        balanceBefore - amount
      );
    });

    it("should retrieve external token from sDappStake and increase owner’s balance", async () => {
      await otherToken.transfer(sDappStake.getAddress(), amount);
      const ownerMOARBalanceBefore: BigNumberish = await otherToken.balanceOf(
        deployer
      );

      await sDappStake.recoverERC20(otherToken.getAddress(), amount);

      const ownerMOARBalanceAfter: BigNumberish = await otherToken.balanceOf(
        deployer
      );
      expect(ownerMOARBalanceAfter - ownerMOARBalanceBefore).to.equal(amount);
    });

    it("should emit Recovered event", async () => {
      await otherToken.transfer(sDappStake.getAddress(), amount);
      const transaction = await sDappStake.recoverERC20(
        otherToken.getAddress(),
        amount
      );
      await expect(transaction)
        .to.emit(sDappStake, "Recovered")
        .withArgs(otherToken.getAddress(), amount);
    });
  });

  describe("lastTimeRewardApplicable()", () => {
    const rewardValue = ethers.parseUnits("5000000", 18);

    it("should return 0", async () => {
      expect(await sDappStake.lastTimeRewardApplicable()).to.equal(ZERO_BN);
    });

    describe("when updated", () => {
      it("should equal current timestamp", async () => {
        await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
        await sDappStake.notifyRewardAmount(rewardValue);

        const cur = await currentTime();
        const lastTimeReward = await sDappStake.lastTimeRewardApplicable();

        expect(cur).to.equal(lastTimeReward);
      });
    });
  });

  describe("rewardPerToken()", () => {
    it("should return 0", async () => {
      expect(await sDappStake.rewardPerToken()).to.equal(ZERO_BN);
    });

    it("should be greater than 0", async () => {
      const stakingAccount1Sign = signers[1];
      const stakingAccount1 = stakingAccount1Sign.address;
      const totalToStake = ethers.parseUnits("100", 18);

      await sDappToken.transfer(stakingAccount1, totalToStake);
      await sDappToken
        .connect(stakingAccount1Sign)
        .approve(sDappStake.getAddress(), totalToStake);
      await sDappStake.connect(stakingAccount1Sign).stake(totalToStake);

      const totalSupply = await sDappStake.totalSupply();
      expect(totalSupply).to.be.gt(ZERO_BN);

      const rewardValue = ethers.parseUnits("500", 18);
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      await sDappStake.notifyRewardAmount(rewardValue);

      await fastForward(365 * DAY);

      const rewardPerToken = await sDappStake.rewardPerToken();
      expect(rewardPerToken).to.be.gt(ZERO_BN);
    });
  });

  describe("stake()", () => {
    it("staking increases staking balance", async () => {
      const stakingAccount1Sign = signers[1];
      const stakingAccount1 = stakingAccount1Sign.address;
      const totalToStake = ethers.parseUnits("100", 18);

      await sDappToken.transfer(stakingAccount1, totalToStake);
      await sDappToken
        .connect(stakingAccount1Sign)
        .approve(sDappStake.getAddress(), totalToStake);

      const initialStakeBal = await sDappStake.balanceOf(stakingAccount1);
      const initialBal = await sDappToken.balanceOf(stakingAccount1);

      await sDappStake.connect(stakingAccount1Sign).stake(totalToStake);

      const postStakeBal = await sDappStake.balanceOf(stakingAccount1);
      const postBal = await sDappToken.balanceOf(stakingAccount1);

      expect(postBal).to.be.lt(initialBal);
      expect(postStakeBal).to.be.gt(initialStakeBal);
    });

    it("cannot stake 0", async () => {
      await expect(sDappStake.stake(0)).to.be.revertedWith(
        "sDappStake::CANNOT_STAKE_ZERO"
      );
    });
    it("cannot stake over limit", async () => {
      const stakeValue = await ethers.parseUnits("60000", 18);

      await expect(sDappStake.stake(stakeValue)).to.be.revertedWith(
        "sDappStake::STAKE_LIMIT_EXCEEDED"
      );
    });
    it("should change stakeLimit and stake over previous limit", async () => {
      const limitValue = ethers.parseUnits("250000", 18);
      const stakeValue = ethers.parseUnits("60000", 18);

      await sDappStake.updateStakeLimit(limitValue);
      expect(await sDappStake.stakeLimit()).to.equal(limitValue);

      await sDappToken.approve(sDappStake.getAddress(), stakeValue);
      await sDappStake.stake(stakeValue);
      await expect(
        sDappStake.stake(ethers.parseUnits("1000000", 18))
      ).to.be.revertedWith("sDappStake::STAKE_LIMIT_EXCEEDED");
    });
  });

  describe("Compounding Rewards Exploit Prevention", () => {
    const rewardValue = ethers.parseUnits("5000000", 18);
    const totalToStake = ethers.parseUnits("100", 18);

    let stakingAccount1Sign: any;
    let stakingAccount1: string;

    beforeEach(async () => {
      const limitValue = ethers.parseUnits("10000000", 18);
      await sDappStake.updateStakeLimit(limitValue); //increases limit value for this test

      // Initialize stakingAccount1Sign as one of the signers
      stakingAccount1Sign = signers[1];
      stakingAccount1 = stakingAccount1Sign.address;

      // Transfer initial tokens to staking account
      await sDappToken.transfer(stakingAccount1, totalToStake);

      // Approve and stake initial amount
      await sDappToken
        .connect(stakingAccount1Sign)
        .approve(sDappStake.getAddress(), totalToStake);

      await sDappStake.connect(stakingAccount1Sign).stake(totalToStake);

      // Transfer reward tokens to the contract
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      await sDappStake.notifyRewardAmount(rewardValue);
    });

    it("should prevent disproportionate balance increase by compounding frequently", async () => {
      // Fast forward time so that some rewards accumulate
      await fastForward(30 * DAY); // Fast forward by 30 days to allow sufficient rewards to accumulate

      // Check initial earned rewards
      const initialEarned = await sDappStake.earned(stakingAccount1);
      console.log(
        `Initial Earned Rewards: ${ethers.formatUnits(initialEarned, 18)}`
      );
      expect(initialEarned).to.be.gt(
        ZERO_BN,
        "Initial earned rewards should be greater than zero"
      );

      // Compound the rewards once (should succeed)
      await sDappStake.connect(stakingAccount1Sign).compound();

      // Check that earned rewards are now zero
      const earnedAfterFirstCompound = await sDappStake.earned(stakingAccount1);
      console.log(
        `Earned After First Compound: ${ethers.formatUnits(
          earnedAfterFirstCompound,
          18
        )}`
      );
      expect(earnedAfterFirstCompound).to.equal(
        ZERO_BN,
        "Earned rewards should be zero after compounding"
      );

      // Ensure the user's balance increased after compounding
      const postFirstCompoundBalance = await sDappStake.balanceOf(
        stakingAccount1
      );
      expect(postFirstCompoundBalance).to.be.gt(
        totalToStake,
        "Balance should increase after the first compound"
      );

      // Try to compound again (this should revert with ZERO_REWARD_AMOUNT)
      await expect(
        sDappStake.connect(stakingAccount1Sign).compound()
      ).to.be.revertedWith("sDappStake::ZERO_REWARD_AMOUNT");

      // Fast forward time to allow new rewards to accumulate
      await fastForward(30 * DAY); // Fast forward by another 30 days

      // Simulate new reward distribution (add more rewards to the contract)
      const additionalRewards = ethers.parseUnits("5000000", 18);

      // Transfer additional tokens and notify the contract
      await sDappToken.transfer(sDappStake.getAddress(), additionalRewards);

      // Re-notify reward amount after fast-forward
      await sDappStake.notifyRewardAmount(additionalRewards);

      // Fast forward again to simulate reward accumulation over time
      await fastForward(1 * DAY);

      // Earn some new rewards and confirm that the user can compound again
      const earnedBeforeSecondCompound = await sDappStake.earned(
        stakingAccount1
      );
      console.log(
        `Earned Before Second Compound: ${ethers.formatUnits(
          earnedBeforeSecondCompound,
          18
        )}`
      );

      expect(earnedBeforeSecondCompound).to.be.gt(
        ZERO_BN,
        "New rewards should accumulate after notifying the contract"
      );

      // Compound again (should succeed this time)
      await sDappStake.connect(stakingAccount1Sign).compound();

      // Ensure the user's balance increased again after compounding the new rewards
      const finalBalance = await sDappStake.balanceOf(stakingAccount1);
      console.log(
        `Final Staked Balance after compounding: ${ethers.formatUnits(
          finalBalance,
          18
        )} tokens`
      );
      expect(finalBalance).to.be.gt(
        postFirstCompoundBalance,
        "Balance should increase after compounding new rewards"
      );
    });
  });

  // Other tests would follow the same structure as above, converted from JS to TS.
});

const currentTime = async (): Promise<number> => {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);

  if (block === null) {
    throw new Error("Block not found");
  }

  return block.timestamp;
};

const fastForward = async (seconds: number): Promise<void> => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
};
