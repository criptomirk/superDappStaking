import hre, { upgrades, ethers } from "hardhat";
import { BaseContract, Contract, ContractInterface, Signer } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { GroupMembership, GroupMembership__factory, SuperDapp, SuperDapp__factory } from "../typechain-types";

const main = async () => {
    const signers = await ethers.getSigners();

    const deployer: Signer = signers[0];


    const gmProxyAddress = process.env.GM_IMPL_ADDR || '';
    const bankProxyAddress = process.env.BANK_IMPL_ADDR || '';

    console.log(`GM Proxy Address: ${gmProxyAddress}`);
    console.log(`Bank Proxy Address: ${bankProxyAddress}`);

    console.log(`Fetching implementation addresses...`);

    const gmImplementation = await upgrades.erc1967.getImplementationAddress(gmProxyAddress);
    const bankImplementation = await upgrades.erc1967.getImplementationAddress(bankProxyAddress);

    console.log(`Group Membership implementation address: ${gmImplementation}`);
    console.log(`Super Dapp implementation address: ${bankImplementation}`);

    if (gmImplementation === '' || bankImplementation === '') {
        console.error("Please provide GM_IMPL_ADDR and BANK_IMPL_ADDR in the environment variables.");
        throw new Error("Missing environment variables.");
    }

    console.log(`Deployment check completed.`);

    console.log(`Checking configuration...`);

    const gmEntrypoint = (new ethers.Contract(gmProxyAddress, GroupMembership__factory.abi, deployer)) as unknown as GroupMembership;
    const bankEntrypoint = (new ethers.Contract(bankProxyAddress, SuperDapp__factory.abi, deployer)) as unknown as SuperDapp;

    console.log(`Group Membership entrypoint: ${await gmEntrypoint.getAddress()}`);
    console.log(`Super Dapp entrypoint: ${await bankEntrypoint.getAddress()}`);

    const protocolFee = await bankEntrypoint.protocolFeePercent();
    const subjectFee = await bankEntrypoint.subjectFeePercent();
    const treasuryAddress = await bankEntrypoint.treasuryAddress();

    console.log(`Protocol Fee: ${protocolFee}`);
    console.log(`Subject Fee: ${subjectFee}`);
    console.log(`Treasury Address: ${treasuryAddress}`);

    const gmBankAddress = await gmEntrypoint.dappAddress();

    console.log(`Dapp Address in Group Membership: ${gmBankAddress}`);

    console.log(`Dapp address in Group Membership matches Super Dapp address: ${gmBankAddress === bankProxyAddress}`);
}

main().then(() => {
    console.log(`Deployment check completed.`);
}).catch(error => {
    console.error(error);
    throw new Error("Deployment check failed.");
});