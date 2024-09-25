// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { upgrades, ethers } from "hardhat";
import { BaseContract, Contract, ContractInterface, Signer } from "ethers";

import {
  SuperDappToken__factory,
  GroupMembership__factory,
  SuperDapp__factory,
  GroupMembership,
  // eslint-disable-next-line node/no-missing-import
} from "../typechain-types"

async function main() {

  const delay = (ms: number) => {
    console.log(`---> Waiting for ${ms} ms`);
    return new Promise((resolve) => setTimeout(resolve, ms))
  };

  const network = hre.network.name;

  console.log(`Using network - ${network}`);

  const signers = await ethers.getSigners();

  const deployer: Signer = signers[0];

  console.log("Deployer address", await deployer.getAddress());
  const balance = ethers.formatEther(await ethers.provider.getBalance(await deployer.getAddress()));


  const treasuryAddress = process.env.TREASURY_ADDRESS || await deployer.getAddress();

  console.log("Deploying contracts with the account:", await deployer.getAddress());

  console.log("Account balance:", balance);


  let tokenAddress: string | null = null;

  const tokenAddressEnv = network === "rollux" ? process.env.SDT_TOKEN_ADDRESS_MAINNET : process.env.SDT_TOKEN_ADDRESS;

  if (tokenAddressEnv === undefined) {
    // deploy token contract

    const SuperDappToken = new SuperDappToken__factory(deployer);

    const deployedToken = await upgrades.deployProxy(SuperDappToken);
    await deployedToken.waitForDeployment();

    tokenAddress = await deployedToken.getAddress();
  } else {
    tokenAddress = tokenAddressEnv;
  }

  console.log("Token deployed to:", tokenAddress);

  if (tokenAddressEnv === undefined) {
    try {
      await hre.run("verify:verify", {
        address: tokenAddress,
      });

      console.log("Token verified");
    } catch (e) {
      // @ts-ignore
      if (e.message.includes("Unknown action")) {
        console.log("Skipping token verification etherscan api");
      } else {
        throw e;
      }
    }

    await hre.run("verify:verify", {
      address: await upgrades.erc1967.getImplementationAddress(tokenAddress),
    });
  } else {
    console.log("Skipping token verification etherscan api because using existing token");
  }



  console.log("Deploying group membership contract");
  const groupMembershipFactory = new GroupMembership__factory(deployer);
  console.log('Factory created');
  const groupMembership: GroupMembership = (await upgrades.deployProxy(groupMembershipFactory)) as unknown as GroupMembership;
  console.log('Proxy deployed');
  await groupMembership.waitForDeployment();

  await delay(10000);


  console.log("GroupMembership(Proxy) deployed to:", await groupMembership.getAddress());
  console.log("Trying to verify");
  console.log("Implementation address", await upgrades.erc1967.getImplementationAddress(await groupMembership.getAddress()));

  console.log("Verify GM proxy");



  try {
    await hre.run("verify:verify", {
      address: await groupMembership.getAddress(),
      constructorArguments: [],
    });
  } catch (e) {
    // @ts-ignore
    if (e.message.includes("Unknown action")) {
      console.log("Skipping GM verification etherscan api");
    } else {
      console.log(e);
    }
  }

  console.log("Verify GM implementation");

  await delay(10000);

  try {
    await hre.run("verify:verify", {
      address: await upgrades.erc1967.getImplementationAddress(await groupMembership.getAddress()),
      constructorArguments: [],
    });

    await delay(10000);
  } catch (e) {
    console.log('Failed to verify GM imnpelmentation');
    console.log('Forcing to next steps');
  }

  const bankFactory = new SuperDapp__factory(deployer);
  const bank = await upgrades.deployProxy(bankFactory, [treasuryAddress, tokenAddress, await groupMembership.getAddress()]);

  await bank.waitForDeployment();

  await delay(10000);

  console.log("Bank deployed to:", await bank.getAddress());

  await groupMembership.setDappAddress(await bank.getAddress());

  console.log("GroupMembership deployed to:", await groupMembership.getAddress());

  console.log("Trying to verify BANK");

  try {

    await delay(10000);
    await hre.run("verify:verify", {
      address: await bank.getAddress(),
    });
  } catch (e) {
    // @ts-ignore
    if (e.message.includes("Unknown action")) {
      console.log("Skipping BANK verification etherscan api");
    } else {
      console.log(e);
    }
  }

  console.log("Verify BANK implementation");

  try {

    await delay(10000);

    await hre.run("verify:verify", {
      address: await upgrades.erc1967.getImplementationAddress(await bank.getAddress()),
      constructorArguments: [treasuryAddress, tokenAddress, await groupMembership.getAddress()],
    });
  } catch (e) {
    console.log('Failed to verify BANK imnpelmentation');

    console.log(e);

    console.log('Forcing to next steps');
  }



  console.log("All contracts deployed and verified");

  console.log("GroupMembership address", await groupMembership.getAddress());
  console.log("Bank address", await bank.getAddress());

  console.log("Token address", tokenAddress);

  console.log("Treasury address", treasuryAddress);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);

  if (error.toString().includes("Unknown action")) {
    console.warn("Skipping etherscan verification for proxy.");
  } else {
    process.exitCode = 1;
  }
});
