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

    const tokenAddress = process.env.SDT_TOKEN_ADDRESS || '';

    console.log("Deployer address", await deployer.getAddress());
    const treasuryAddress = process.env.TREASURY_ADDRESS || await deployer.getAddress();
    const gmImplementation = await upgrades.erc1967.getImplementationAddress(process.env.GM_IMPL_ADDR || '');
    const bankImplementation = await upgrades.erc1967.getImplementationAddress(process.env.BANK_IMPL_ADDR || '');

    console.log("Group Membership implementation address", gmImplementation);
    console.log("Super Dapp implementation address", bankImplementation);

    await hre.run("verify:verify", {
        address: gmImplementation,
        constructorArguments: [],
    });

    console.log("Group Membership implementation verified");

    await hre.run("verify:verify", {
        address: bankImplementation,
        constructorArguments: [],
    });

    console.log("Super Dapp implementation verified");

}

main().catch((error) => {
    console.error(error);

    if (error.toString().includes("Unknown action")) {
        console.warn("Skipping etherscan verification for proxy.");
    } else {
        process.exitCode = 1;
    }
});