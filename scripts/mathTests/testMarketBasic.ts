import hre, { upgrades, ethers } from "hardhat";
import "@nomicfoundation/hardhat-ethers";
import { randomInt } from "crypto";
import { BigNumberish, ContractTransactionReceipt, ContractTransaction, Signer, ContractFactory, BaseContract, Contract, EventLog, LogParams, Log, Wallet, HDNodeVoidWallet, HDNodeWallet, getBigInt } from "ethers";

// eslint-disable-next-line node/no-missing-import
import { GroupMembership, GroupMembership__factory, SuperDapp, SuperDappToken, SuperDappToken__factory, SuperDapp__factory } from "../../typechain";
import {
    ACTION_BUY_SHARES,
    ACTION_CREATE_GROUP,
    ACTION_DEPOSIT,
    ACTION_SELL_SHARES,
    ACTION_SKIP,
    ACTION_WITHDRAW,
    chanceDeposit,
    decideUserAction,
    eth2Human,
    intToBn,
    proposeGroup,
    snapShotBank,
    snapShotPotentialProfits,
    snapShotTokenBalance,
    // eslint-disable-next-line node/no-missing-import
} from "./_common";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import fs from "fs";

const TOTAL_USERS_COUNT = 50;
const strategy: number = 7;


async function main() {

    const signers = await ethers.getSigners();
    const admin: Signer = signers[0];
    const treasury: Signer = signers[1];


    const bankSnapShots = [];
    const tokenSnapShots = [];
    const potentialProfitsSnapShots = [];


    const people: HDNodeWallet[] = [];

    let walletsReady: boolean = false;


    const bankFactory: ContractFactory<any, SuperDapp__factory> = await ethers.getContractFactory("SuperDapp") as unknown as ContractFactory<any, SuperDapp__factory>;
    const tokenFactoryRaw: SuperDappToken__factory = await ethers.getContractFactory("SuperDappToken") as unknown as SuperDappToken__factory;
    const tokenFactory = tokenFactoryRaw as unknown as ContractFactory<any, SuperDappToken__factory>;
    const gm: ContractFactory<any, GroupMembership__factory> = await ethers.getContractFactory("GroupMembership") as unknown as ContractFactory<any, GroupMembership__factory>;

    const token: SuperDappToken = await upgrades.deployProxy(tokenFactory, []) as unknown as SuperDappToken;
    await token.waitForDeployment()
    const groupMembership: GroupMembership = await gm.deploy() as unknown as GroupMembership;
    await groupMembership.waitForDeployment()
    const bank = await upgrades.deployProxy(bankFactory, [
        await admin.getAddress(),
        await token.getAddress(),
        await groupMembership.getAddress(),
    ]) as unknown as SuperDapp;
    await bank.waitForDeployment()

    await groupMembership.setDappAddress(await bank.getAddress());

    console.log("Protocol deployed:");
    console.log("Token:", await token.getAddress());
    console.log("Bank:", await bank.getAddress());
    console.log("Group:", await groupMembership.getAddress());


    console.log('Creating wallets...');

    const createWallets = async (totalCount: number, cb: (wallets: HDNodeWallet[]) => void) => {

        const people: HDNodeWallet[] = [];

        for (let i = 1; i < totalCount; i++) {
            const wallet: HDNodeWallet = ethers.Wallet.createRandom();

            people.push(
                wallet.connect(ethers.provider)
            );

            if (i % 100 === 0) {
                console.log(`WalletsPrep: ${i} / ${TOTAL_USERS_COUNT}`);
            }
        }

        return cb(people);
    }


    createWallets(TOTAL_USERS_COUNT, (wallets) => {
        walletsReady = true;
        people.push(...wallets);
    });


    // eslint-disable-next-line no-unmodified-loop-condition
    while (!walletsReady) {
        console.log("Waiting for wallets to be ready...");
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // split total supply between all available users 

    const totalSupply = await token.totalSupply();

    console.log("Total supply:", totalSupply.toString());

    // split algo -- waterfall

    const splitSupply = async (totalSupply: BigNumberish, wallets: HDNodeWallet[]) => {

        let supplyLeft: BigNumberish = totalSupply;
        let totalDistributed: BigNumberish = intToBn(0);


        for (let i = 0; i < wallets.length; i++) {
            const supplyPerWallet = intToBn(parseFloat(eth2Human(supplyLeft.toString())) * (randomInt(1, 4) / 100));

            supplyLeft = getBigInt(supplyLeft) - getBigInt(supplyPerWallet);

            // console.log(supplyPerWallet.toString());
            const wallet = wallets[i];
            const tx = await token.connect(admin).transfer(wallet.address, supplyPerWallet);
            // @ts-ignore
            await tx.wait();

            totalDistributed = getBigInt(totalDistributed) + getBigInt(supplyPerWallet);

            // need to cover fees too , send 1 eth to each wallet

            const tx2 = await admin.sendTransaction({
                to: wallet.address,
                value: intToBn(1),
            });

            await tx2.wait();

            if (i % 5 === 0) {
                console.log(`SupplySplit: ${i} / ${TOTAL_USERS_COUNT}`);
            }
        }

        console.log("Total distributed:", eth2Human(totalDistributed));
        console.log("Supply left:", eth2Human(supplyLeft));
        console.log("Max", eth2Human(totalSupply));

    }


    await splitSupply(totalSupply, people);

    console.log("Supply split finished!");

    const tokensPool: { [key: string]: string[] } = {}; // wallet address -> token ids

    const groupsPool: { [key: number]: BigNumberish } = {}; // key - group id, value min joinAmount

    const soldShares: number[] = [];
    const tmpSoldShares: number[] = [];



    const actionsHistory: { [key: string]: string[] } = {};


    for (let index = 0; index < people.length; index++) {
        const wallet = people[index];
        actionsHistory[wallet.address] = [];
        tokensPool[wallet.address] = [];
    }

    // start simulation

    const simulationDuration = 0.5; // half of day
    const durationHours = 24 * simulationDuration;
    let currentHour = 0;

    console.log("Selected strategy:", strategy);

    // lets create first one group by admin!


    if (strategy !== 3 && strategy !== 4 && strategy !== 5 && strategy !== 6 && strategy !== 7) {
        const tx = await bank.connect(admin).createGroup(intToBn(10), 0, {
            from: await admin.getAddress(),
        });

        // @ts-ignore
        await tx.wait();

    } else {
        const tx = await bank.connect(admin).createGroupWithoutPreset(
            intToBn(10),
            1,
            80,
            40,
            {
                from: await admin.getAddress(),
            });

        // @ts-ignore
        await tx.wait();


        const customGroupId = await bank.groupIndex();


        await Promise.all([[4, 2], [6, 5], [8, 10]].map(async ([hours, bonus]) => {
            const addBonusTx = await bank.connect(admin).addGroupTimeBonus(
                customGroupId,
                hours,
                bonus,
                { from: await admin.getAddress() }
            )
            // @ts-ignore
            await addBonusTx.wait();
        }));

        console.log(await groupMembership.groupBonuses(customGroupId));

    }

    const createdIndex = await bank.groupIndex();
    const groupSettings:
        [number, number, boolean, number, BigNumberish, BigNumberish, string, BigNumberish, BigNumberish, BigNumberish]
        = await groupMembership.groups(createdIndex)

    const groupId = createdIndex.toString();
    const minJoinAmount = groupSettings[7];

    groupsPool[parseInt(createdIndex.toString())] = minJoinAmount;



    const strategyMemory: { [key: string]: any } = {}; // strategy memory context 


    const resultWriter = (fileName: string, data: any, strategy: number) => {

        if (!fs.existsSync(`./scripts/mathTests/results/${strategy}`)) {
            fs.mkdirSync(`./scripts/mathTests/results/${strategy}`);
        }

        fs.writeFileSync(`./scripts/mathTests/results/${strategy}/${fileName}.json`, JSON.stringify(data));
    }


    /**
     * Initial deposits
     */

    await Promise.all(people.map(async (wallet, index) => {
        const amount = getBigInt(ethers.parseEther('1000'));

        const tx = await token.connect(wallet).approve(await bank.getAddress(), amount);
        // @ts-ignore
        await tx.wait();

        const tx2 = await bank.connect(wallet).deposit(amount);
        // @ts-ignore
        await tx2.wait();

    }));

    const initialBank = await snapShotBank(bank, admin, people, groupsPool);
    const initialTokenBalance = await snapShotTokenBalance(token, people);
    const initialPotentialProfits = await snapShotPotentialProfits(tokensPool, bank, [], people);

    bankSnapShots.push(initialBank);
    tokenSnapShots.push(initialTokenBalance);
    potentialProfitsSnapShots.push(initialPotentialProfits);

    const simulationStart = await time.latest();

    console.log("Simulation start:", simulationStart.toString());

    console.log(people.map((wallet, index) => {
        return "\n Wallet: " + wallet.address + " / " + index;
    }));


    while (currentHour < durationHours) {
        console.log(`Simulation hour: ${currentHour} / ${durationHours}`);
        let sumOfTokens = 0;

        Object.keys(tokensPool).map((wallet) => {
            sumOfTokens += tokensPool[wallet].length;
        });

        console.log(`Sum of tokens in pool: ${sumOfTokens} / ${currentHour}`);

        await Promise.all(people.map(async (wallet, index) => {
            const userAction = decideUserAction(
                actionsHistory[wallet.address],
                people,
                index,
                currentHour,
                durationHours,
                strategy,
                strategyMemory
            );

            if (userAction === ACTION_SKIP) {
                actionsHistory[wallet.address].push(ACTION_SKIP);
                return;
            }

            switch (userAction) {
                case ACTION_DEPOSIT: {
                    // for deposit will use random percentage of user token balance

                    const tokenBalance = await token.balanceOf(wallet.address);
                    const percentage = randomInt(10, 15);
                    //const amount = tokenBalance.mul(ethers.BigNumber.from(percentage)).div(100);

                    const amount = strategy === 0 ? intToBn(parseFloat(eth2Human(tokenBalance)) * (percentage / 100)) :
                        getBigInt(ethers.parseEther('1000'));


                    const tx = await token.connect(wallet).approve(await bank.getAddress(), amount);
                    // @ts-ignore
                    await tx.wait();

                    const tx2 = await bank.connect(wallet).deposit(amount);
                    // @ts-ignore
                    await tx2.wait();

                    actionsHistory[wallet.address].push(ACTION_DEPOSIT);

                    break;
                }
                case ACTION_WITHDRAW: {
                    if (await bank.connect(wallet).balanceOf(wallet.address) === getBigInt(0)) {
                        actionsHistory[wallet.address].push(ACTION_SKIP);
                        break;
                    }

                    try {
                        const tx = await bank.connect(wallet).withdraw();
                        // @ts-ignore
                        await tx.wait();

                        actionsHistory[wallet.address].push(ACTION_WITHDRAW);
                    } catch (e: any) {
                        console.log("Error while withdrawing:", e.message);
                    }

                    break;
                }
                case ACTION_BUY_SHARES: {

                    // before buy shares, check if user have anything at balance
                    const availableBalance = await bank.balanceOf(wallet.address);
                    const walletTokenBalance = await token.balanceOf(wallet.address);

                    if (getBigInt(availableBalance) === getBigInt(0) && getBigInt(walletTokenBalance) === getBigInt(0)) {
                        actionsHistory[wallet.address].push(ACTION_SKIP);
                        break;
                    }

                    const budget = getBigInt(availableBalance);
                    // const budget = ethers.formatEther()
                    //const budget = availableBalance.add(walletTokenBalance);

                    let bestGroupFound = true;
                    let attemptsToFindGroup = 0;

                    let finalGroup: {
                        id: string,
                        minJoinAmount: BigNumberish
                    } | null = {
                        id: groupId,
                        minJoinAmount: intToBn(10)

                    };

                    // removed best group research algo from here.
                    // while (!bestGroupFound || attemptsToFindGroup < 10) { // try to find best one based on current balance
                    //     const proposedGroup = proposeGroup(groupsPool);

                    //     const minJoinAmount = proposedGroup.minJoinAmount;
                    //     const groupIndex = proposedGroup.id;

                    //     if (getBigInt(minJoinAmount) <= getBigInt(budget)) {
                    //         bestGroupFound = true;
                    //         finalGroup = proposedGroup;
                    //         break;
                    //     }

                    //     attemptsToFindGroup++;
                    // }

                    // if (!bestGroupFound || finalGroup === null) {
                    //     actionsHistory[wallet.address].push(ACTION_SKIP); // just skip maybe
                    //     break;
                    // }

                    const allIn = false;
                    const percentNotAllIn = randomInt(5, 10); // 5-10 of available balance invested
                    let amount = allIn ? availableBalance :
                        parseFloat(eth2Human(budget)) * (percentNotAllIn / 100);

                    const ableToDepositMore = randomInt(0, 100) < chanceDeposit;

                    if (Number(availableBalance) < Number(amount)) {

                        if (!ableToDepositMore) {
                            amount = getBigInt(availableBalance) >= getBigInt(finalGroup.minJoinAmount) ? getBigInt(availableBalance) : intToBn(0); // take all available
                        } else {
                            const diff = getBigInt(amount) - getBigInt(availableBalance);

                            const tx = await token.connect(wallet).approve(await bank.getAddress(), diff);
                            // @ts-ignore
                            await tx.wait();

                            const tx2 = await bank.connect(wallet).deposit(diff);
                            // @ts-ignore
                            await tx2.wait();
                        }
                    }

                    if (Number(amount) <= 0) {
                        actionsHistory[wallet.address].push(ACTION_SKIP);
                        break;
                    }

                    /**
                     * if strategy we'll use fixed 10 tokens
                     */

                    if (strategy !== 0) {
                        amount = ethers.parseEther('10');
                    }

                    let tokenId: BigNumberish | null = null;

                    try {
                        const tx = await bank.connect(wallet).buyShares(
                            finalGroup.id,
                            amount,
                        );

                        // @ts-ignore
                        const receipt: ContractTransactionReceipt = await tx.wait();

                        const eventLog: EventLog | Log = receipt.logs[2];

                        // @ts-ignore
                        tokenId = eventLog.args.tokenId;

                        if (tokenId === null) {
                            actionsHistory[wallet.address].push(ACTION_SKIP);
                        } else if (tokenId !== undefined && tokenId !== null) {

                            tokensPool[wallet.address].push(tokenId.toString());


                            actionsHistory[wallet.address].push(ACTION_BUY_SHARES);
                        }
                    } catch (e: any) {
                        if (e instanceof Error) {
                            console.log(e.message);
                            console.log("Error while buying shares:", e.message);
                            console.log("Amount to buy:", amount);
                            console.log("Available balance:", await bank.balanceOf(wallet.address));
                            console.log("All in:", allIn);
                            process.exit(1);
                        }
                    }

                    break;
                }
                // @ts-ignore
                case ACTION_CREATE_GROUP: {

                    const newGroupMinJoinAmount = getBigInt(randomInt(5, 10));

                    const tx = await bank.connect(wallet).createGroup(newGroupMinJoinAmount, 1);
                    // @ts-ignore
                    await tx.wait();

                    const createdIndex = await bank.groupIndex();
                    const groupSettings:
                        [number, number, boolean, number, BigNumberish, BigNumberish, string, BigNumberish, BigNumberish, BigNumberish]
                        = await groupMembership.groups(createdIndex)

                    groupsPool[createdIndex.toNumber()] = groupSettings[7];

                    actionsHistory[wallet.address].push(ACTION_CREATE_GROUP);

                    break;
                }
                case ACTION_SELL_SHARES: {
                    const tokenIds = tokensPool[wallet.address];

                    if (tokenIds.length === 0) {
                        actionsHistory[wallet.address].push(ACTION_SKIP);
                        break;
                    }

                    let tokenPoolCursor: number = 0;
                    let tokenId = tokenIds[tokenPoolCursor];

                    let foundUnsoldToken = false;

                    while (!foundUnsoldToken) {
                        if (!soldShares.includes(parseInt(tokenId))) {
                            foundUnsoldToken = true;
                        } else {
                            tokenPoolCursor = tokenIds.length > 1 ? tokenPoolCursor + 1 : 0;
                            tokenId = tokenIds[tokenPoolCursor];

                            if (tokenPoolCursor === tokenIds.length) {
                                // sold everything  already
                                actionsHistory[wallet.address].push(ACTION_SKIP);
                                break;
                            }
                        }
                    }

                    try {
                        // console.log(tokenId);

                        if (tokenId === undefined) {

                            actionsHistory[wallet.address].push(ACTION_SELL_SHARES);

                            soldShares.push(parseInt(tokenId));

                            break;
                        }

                        const tx = await bank.connect(wallet).sellShares(parseInt(tokenId));
                        // @ts-ignore
                        await tx.wait();

                        actionsHistory[wallet.address].push(ACTION_SELL_SHARES);

                        //delete tokensPool[wallet.address][tokenPoolCursor];

                        soldShares.push(parseInt(tokenId));
                        break;
                    } catch (e: any) {

                        console.log(`Error while selling shares: ${e.message}`);

                        if (e.message.includes('range')) {
                            actionsHistory[wallet.address].push(ACTION_SKIP);
                        }

                        // something else if another error
                        actionsHistory[wallet.address].push(ACTION_SKIP);



                        break;
                    }

                }
            }
        }));

        await time.increase(3600); // 1 hour
        currentHour++;

        bankSnapShots.push(await snapShotBank(bank, admin, people, groupsPool));
        tokenSnapShots.push(await snapShotTokenBalance(token, people));
        potentialProfitsSnapShots.push(await snapShotPotentialProfits(tokensPool, bank, soldShares, people));
    }

    console.log(await time.latest());

    console.log("Simulation finished!");

    console.log("Dumping results...");

    resultWriter('bankSnapShots', bankSnapShots, strategy);
    resultWriter('tokenSnapShots', tokenSnapShots, strategy);
    resultWriter('potentialProfitsSnapShots', potentialProfitsSnapShots, strategy);

    // fs.writeFileSync('./scripts/mathTests/results/bankSnapShots.json', JSON.stringify(bankSnapShots));
    // fs.writeFileSync('./scripts/mathTests/results/tokenSnapShots.json', JSON.stringify(tokenSnapShots));
    // fs.writeFileSync('./scripts/mathTests/results/potentialProfitsSnapShots.json', JSON.stringify(potentialProfitsSnapShots));
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});