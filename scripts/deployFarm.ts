// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";
import { Signer, Wallet } from "ethers";
import { SuperDappStake__factory, SuperDappStake } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Please set your PRIVATE_KEY in a .env file");
  }

  const provider = new ethers.JsonRpcProvider(process.env.ROLLUX_URL);
  const deployer: Signer = new Wallet(privateKey, provider);
  const firstLimit = ethers.parseUnits("2000000", 18);
  const SDappToken = "0x2Fd2A58E17FA9c5d148c27d63f8ea47CB828D7f6"; //changes accordingly to network

  console.log(
    "Deploying contracts with the account:",
    await deployer.getAddress()
  );

  const balance = ethers.formatEther(
    await provider.getBalance(await deployer.getAddress())
  );
  console.log("Account balance:", balance);

  console.log("Deploying SuperDappStake contract");
  const SuperDappStakeFactory = new SuperDappStake__factory(deployer);
  const superDappStake: SuperDappStake = await SuperDappStakeFactory.deploy(
    SDappToken,
    firstLimit,
    {
      gasLimit: 5000000,
      gasPrice: ethers.parseUnits("20", "gwei"),
    }
  );

  await superDappStake.waitForDeployment();

  const contractAddress = await superDappStake.getAddress();
  console.log("SuperDappStake deployed to:", contractAddress);

  console.log("Verifying SuperDappStake contract");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [SDappToken, firstLimit],
    });
    console.log("SuperDappStake verified successfully");
  } catch (e) {
    // @ts-ignore
    if (e.message.includes("Unknown action")) {
      console.log("Skipping verification as the Etherscan API was not found.");
    } else {
      console.log("Verification failed:", e);
    }
  }

  console.log("All contracts deployed and verified");
  console.log("SuperDappStake address:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
