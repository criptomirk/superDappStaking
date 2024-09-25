import hre, { upgrades, ethers } from "hardhat";
import { BaseContract, Contract, ContractInterface, Signer } from "ethers";

import {
    SuperDappToken__factory,
    GroupMembership__factory,
    SuperDapp__factory,
    SuperDapp,
    SuperDappToken,
    GroupMembership
    // eslint-disable-next-line node/no-missing-import
} from "../typechain-types"

async function main() {

    const signers = await ethers.getSigners();

    const deployer: Signer = signers[0];

    console.log("Deployer address", await deployer.getAddress());
    const balance = ethers.formatEther(await ethers.provider.getBalance(await deployer.getAddress()));

    const upgradeGM = await upgrades.upgradeProxy(process.env.GM_IMPL_ADDR || '', await ethers.getContractFactory("GroupMembership"));


    console.log("Upgraded Group Membership contract to:", await upgradeGM.getAddress());

    const upgradeSD = await upgrades.upgradeProxy(process.env.BANK_IMPL_ADDR || '', await ethers.getContractFactory("SuperDapp"));

    console.log("Upgraded Super Dapp contract to:", await upgradeSD.getAddress());

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