import { expect } from "chai";
import { ethers, } from "hardhat";
import { SuperDappToken, sDappStake } from "../../typechain-types";
import { BigNumberish, getBigInt } from "ethers";
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe.only("SuperDappStake", function () {
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

  describe("Deployment & Settings", () => {
    it("", async () => {
      console.log("\t\t\t\t\townerAddress:", await sDappStake.owner());
      console.log("\t\t\t\t\tsDappToken:", await sDappStake.sDappToken());
      console.log("\t\t\t\t\tperiodFinish:", await sDappStake.periodFinish());
      console.log("\t\t\t\t\trewardRate:", await sDappStake.rewardRate());
      console.log("\t\t\t\t\trewardsDuration:", await sDappStake.rewardsDuration());
      console.log("\t\t\t\t\tlastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("\t\t\t\t\trewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("\t\t\t\t\t_totalSupply:", await sDappStake.totalSupply());
      console.log("\t\t\t\t\tstakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));
    });
  });

  describe("Rewards set up", () => {
    const rewardValue = ethers.parseUnits("100", 18);

    it("only owner can call notifyRewardAmount", async () => {
      await expect(
        sDappStake.connect(signers[1]).notifyRewardAmount(rewardValue)
      )
        .to.be.revertedWithCustomError(sDappStake, "OwnableUnauthorizedAccount")
        .withArgs(await signers[1].getAddress());
    });
    it("Should set up reward correctly using notifyRewardAmount", async () => {
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      console.log("\t\t\t\t\tDeposited reward:", ethers.formatUnits(await sDappToken.balanceOf(sDappStake.getAddress())));
      console.log("\t\t\t\t\t_totalSupply:", await sDappStake.totalSupply());
      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);

      console.log("\t\t\t\t\townerAddress:", await sDappStake.owner());
      console.log("\t\t\t\t\tsDappToken:", await sDappStake.sDappToken());
      console.log("\t\t\t\t\tperiodFinish:", await sDappStake.periodFinish());
      console.log("\t\t\t\t\trewardRate:", await sDappStake.rewardRate());
      console.log("\t\t\t\t\trewardsDuration:", await sDappStake.rewardsDuration());
      console.log("\t\t\t\t\tlastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("\t\t\t\t\trewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("\t\t\t\t\t_totalSupply:", await sDappStake.totalSupply());
      console.log("\t\t\t\t\tstakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));
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

      // Log the values without (ETH) and with 5 tabs spacing
      console.log("\t\t\t\t\tInitial Staking Balance:", ethers.formatEther(initialStakeBal));
      console.log("\t\t\t\t\tPost Staking Balance:", ethers.formatEther(postStakeBal));
      console.log("\t\t\t\t\tInitial Token Balance:", ethers.formatEther(initialBal));
      console.log("\t\t\t\t\tPost Token Balance:", ethers.formatEther(postBal));
    });
    it("cannot stake 0", async () => {
      await expect(sDappStake.stake(0)).to.be.revertedWith(
        "SuperDappStake::CANNOT_STAKE_ZERO"
      );
    });
    it("cannot stake over limit", async () => {
      const stakeValue = await ethers.parseUnits("60000", 18);

      await expect(sDappStake.stake(stakeValue)).to.be.revertedWith(
        "SuperDappStake::STAKE_LIMIT_EXCEEDED"
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
      ).to.be.revertedWith("SuperDappStake::STAKE_LIMIT_EXCEEDED");
    });
    it("Set reward after some staking", async () => {
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

      // Log the values without (ETH) and with 5 tabs spacing
      console.log("\t\t\t\t\tInitial Staking Balance:", ethers.formatEther(initialStakeBal));
      console.log("\t\t\t\t\tPost Staking Balance:", ethers.formatEther(postStakeBal));
      console.log("\t\t\t\t\tInitial Token Balance:", ethers.formatEther(initialBal));
      console.log("\t\t\t\t\tPost Token Balance:", ethers.formatEther(postBal));


      const rewardValue = ethers.parseUnits("100", 18);
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);


      console.log("\t\t\t\t\t----------Before set Up------------");
      console.log("\t\t\t\t\tperiodFinish:", await sDappStake.periodFinish());
      console.log("\t\t\t\t\trewardRate:", await sDappStake.rewardRate());
      console.log("\t\t\t\t\tlastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("\t\t\t\t\trewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("\t\t\t\t\t_totalSupply:", ethers.formatUnits(await sDappStake.totalSupply()));
      console.log("\t\t\t\t\tstakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));

      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);

      console.log("\t\t\t\t\t----------After set Up------------");
      console.log("\t\t\t\t\tperiodFinish:", await sDappStake.periodFinish());
      console.log("\t\t\t\t\trewardRate:", await sDappStake.rewardRate());
      console.log("\t\t\t\t\tlastUpdateTime:", await sDappStake.lastUpdateTime());
      console.log("\t\t\t\t\trewardPerTokenStored:", await sDappStake.rewardPerTokenStored());
      console.log("\t\t\t\t\t_totalSupply:", ethers.formatUnits(await sDappStake.totalSupply()));
      console.log("\t\t\t\t\tstakeLimit:", ethers.formatUnits(await sDappStake.stakeLimit()));

    });
  });
  describe("Stake() && withdraw() &&  getReward()", () => {
    it("staking, withdraw, getRewards", async () => {

      const rewardValue = ethers.parseUnits("1000", 18);
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);


      const stakeAmount = ethers.parseUnits("100", 18);
      // Loop through 5 staking accounts
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Transfer tokens to each account and approve staking contract
        await sDappToken.transfer(stakingAccount, stakeAmount);
        await sDappToken.connect(stakingAccountSign).approve(sDappStake.getAddress(), stakeAmount);

        const initialStakeBal = await sDappStake.balanceOf(stakingAccount);
        const initialBal = await sDappToken.balanceOf(stakingAccount);

        // Stake the tokens
        await sDappStake.connect(stakingAccountSign).stake(stakeAmount);

        const postStakeBal = await sDappStake.balanceOf(stakingAccount);
        const postBal = await sDappToken.balanceOf(stakingAccount);

        // Log the values for each account
        console.log(`\t\t\t\t\tAccount ${i} Initial Staking Balance:`, ethers.formatEther(initialStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Staking Balance:`, ethers.formatEther(postStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Initial Token Balance:`, ethers.formatEther(initialBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Token Balance:`, ethers.formatEther(postBal));
      }

      // Simulate 10 days passing using the time helper
      await time.increase(10 * 24 * 60 * 60); // 10 days in seconds

      // Each user withdraws and claims rewards
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Withdraw all staked tokens
        const stakedBalance = await sDappStake.balanceOf(stakingAccount);
        await sDappStake.connect(stakingAccountSign).withdraw(stakedBalance);

        const earnedRewards = await sDappStake.earned(stakingAccount);

        // Claim rewards
        await sDappStake.connect(stakingAccountSign).getReward();

        const postWithdrawBal = await sDappToken.balanceOf(stakingAccount);


        // Log the final values after withdraw and rewards
        console.log(`\t\t\t\t\tAccount ${i} Post Withdraw Token Balance:`, ethers.formatEther(postWithdrawBal));
        console.log(`\t\t\t\t\tAccount ${i} Earned Rewards:`, ethers.formatEther(earnedRewards));
      }
    });

  });
  describe("Stake() &&  exit()", () => {

    it("staking, exit", async () => {

      const rewardValue = ethers.parseUnits("1000", 18);
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);

      const stakeAmount = ethers.parseUnits("100", 18);
      // Loop through 5 staking accounts
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Transfer tokens to each account and approve staking contract
        await sDappToken.transfer(stakingAccount, stakeAmount);
        await sDappToken.connect(stakingAccountSign).approve(sDappStake.getAddress(), stakeAmount);

        const initialStakeBal = await sDappStake.balanceOf(stakingAccount);
        const initialBal = await sDappToken.balanceOf(stakingAccount);

        // Stake the tokens
        await sDappStake.connect(stakingAccountSign).stake(stakeAmount);

        const postStakeBal = await sDappStake.balanceOf(stakingAccount);
        const postBal = await sDappToken.balanceOf(stakingAccount);

        // Log the values for each account
        console.log(`\t\t\t\t\tAccount ${i} Initial Staking Balance:`, ethers.formatEther(initialStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Staking Balance:`, ethers.formatEther(postStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Initial Token Balance:`, ethers.formatEther(initialBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Token Balance:`, ethers.formatEther(postBal));
      }

      // Simulate 10 days passing using the time helper
      await time.increase(10 * 24 * 60 * 60); // 10 days in seconds

      // Each user withdraws and claims rewards
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Withdraw all staked tokens
        const stakedBalance = await sDappStake.balanceOf(stakingAccount);
        const earnedRewards = await sDappStake.earned(stakingAccount);

        // Exit (withdraw token &&Claim rewards
        await sDappStake.connect(stakingAccountSign).exit();

        const postWithdrawBal = await sDappToken.balanceOf(stakingAccount);


        // Log the final values after withdraw and rewards
        console.log(`\t\t\t\t\tAccount ${i} Post Withdraw Token Balance:`, ethers.formatEther(postWithdrawBal));
        console.log(`\t\t\t\t\tAccount ${i} Earned Rewards:`, ethers.formatEther(earnedRewards));
      }
    });

  });
  describe("Stake() && compund() && exit()", () => {
    it("staking, exit, and compounding for accounts 4 and 5", async () => {
      const rewardValue = ethers.parseUnits("1000", 18);
      await sDappToken.transfer(sDappStake.getAddress(), rewardValue);
      await expect(sDappStake.notifyRewardAmount(rewardValue)).to.emit(sDappStake, "RewardAdded").withArgs(rewardValue);

      const stakeAmount = ethers.parseUnits("100", 18);

      // Loop through 5 staking accounts
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Transfer tokens to each account and approve staking contract
        await sDappToken.transfer(stakingAccount, stakeAmount);
        await sDappToken.connect(stakingAccountSign).approve(sDappStake.getAddress(), stakeAmount);

        const initialStakeBal = await sDappStake.balanceOf(stakingAccount);
        const initialBal = await sDappToken.balanceOf(stakingAccount);

        // Stake the tokens
        await sDappStake.connect(stakingAccountSign).stake(stakeAmount);

        const postStakeBal = await sDappStake.balanceOf(stakingAccount);
        const postBal = await sDappToken.balanceOf(stakingAccount);

        // Log the values for each account
        console.log(`\t\t\t\t\tAccount ${i} Initial Staking Balance:`, ethers.formatEther(initialStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Staking Balance:`, ethers.formatEther(postStakeBal));
        console.log(`\t\t\t\t\tAccount ${i} Initial Token Balance:`, ethers.formatEther(initialBal));
        console.log(`\t\t\t\t\tAccount ${i} Post Token Balance:`, ethers.formatEther(postBal));
      }

      // Simulate 10 days passing using the time helper
      await time.increase(10 * 24 * 60 * 60); // 10 days in seconds

      // Each user withdraws and claims rewards
      for (let i = 1; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Earned rewards for the account after 10 days
        const earnedRewards = await sDappStake.earned(stakingAccount);

        if (i === 4 || i === 5) {
          // Compounding for account 4 and 5: Claim rewards and stake them again
          await sDappStake.connect(stakingAccountSign).compound();
          console.log(`\t\t\t\t\tAccount ${i} Compounded Earned Rewards:`, ethers.formatEther(earnedRewards));
        } else {
          // Exit (withdraw token & claim rewards)
          const stakedBalance = await sDappStake.balanceOf(stakingAccount);
          await sDappStake.connect(stakingAccountSign).exit();
          const postWithdrawBal = await sDappToken.balanceOf(stakingAccount);

          // Log the final values after withdraw and rewards
          console.log(`\t\t\t\t\tAccount ${i} Post Withdraw Token Balance:`, ethers.formatEther(postWithdrawBal));
          console.log(`\t\t\t\t\tAccount ${i} Earned Rewards:`, ethers.formatEther(earnedRewards));
        }
      }

      // Simulate another 10 days passing for accounts 4 and 5
      await time.increase(10 * 24 * 60 * 60); // Additional 10 days

      // Accounts 4 and 5 withdraw and claim rewards after compounding
      for (let i = 4; i <= 5; i++) {
        const stakingAccountSign = signers[i];
        const stakingAccount = stakingAccountSign.address;

        // Withdraw and claim rewards after compounding
        const stakedBalance = await sDappStake.balanceOf(stakingAccount);
        const finalEarnedRewards = await sDappStake.earned(stakingAccount);
        await sDappStake.connect(stakingAccountSign).exit();
        const finalWithdrawBal = await sDappToken.balanceOf(stakingAccount);


        // Log the final values after withdraw and rewards
        console.log(`\t\t\t\t\tAccount ${i} Final Withdraw Token Balance:`, ethers.formatEther(finalWithdrawBal));
        console.log(`\t\t\t\t\tAccount ${i} Final Earned Rewards after Compounding:`, ethers.formatEther(finalEarnedRewards));
      }
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
        `\t\t\t\t\tInitial Earned Rewards: ${ethers.formatUnits(initialEarned, 18)}`
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
        `\t\t\t\t\tEarned After First Compound: ${ethers.formatUnits(
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
      ).to.be.revertedWith("SuperDappStake::ZERO_REWARD_AMOUNT");

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
        `\t\t\t\t\tEarned Before Second Compound: ${ethers.formatUnits(
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
        `\t\t\t\t\tFinal Staked Balance after compounding: ${ethers.formatUnits(
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
      ).to.be.revertedWith("SuperDappStake::CANNOT_WITHDRAW_STAKING_TOKEN");
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
