import hre, { upgrades, ethers } from "hardhat";
import { BaseContract, Contract, ContractInterface, Signer } from "ethers";


async function main() {

    const signers = await ethers.getSigners();

    const deployer: Signer = signers[0];

    console.log("Deployer address", await deployer.getAddress());
    const balance = ethers.formatEther(await ethers.provider.getBalance(await deployer.getAddress()));

    const gmProxyAddress = process.env.GM_IMPL_ADDR || '';
    const bankProxyAddress = process.env.BANK_IMPL_ADDR || '';

    if (gmProxyAddress === '' || bankProxyAddress === '') {
        console.error("Please provide GM_IMPL_ADDR and BANK_IMPL_ADDR in the environment variables.");
        throw new Error("Missing environment variables.");
    }

    const verifyGm = await hre.run("verify:verify", {
        address: gmProxyAddress,
    });

    console.log("Group Membership proxy verified");

    const verifyBank = await hre.run("verify:verify", {
        address: bankProxyAddress,
    });

    console.log("Super Dapp proxy verified");
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