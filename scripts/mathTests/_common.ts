import { randomInt } from "crypto";
import { BigNumberish, HDNodeWallet, Wallet, ethers, Signer } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { SuperDapp, SuperDappToken } from "../../typechain";
import { token } from "../../typechain-types/@openzeppelin/contracts";

export const ACTION_BUY_SHARES = 'BUY_SHARES';
export const ACTION_SELL_SHARES = 'SELL_SHARES';
export const ACTION_WITHDRAW = 'WITHDRAW';
export const ACTION_DEPOSIT = 'DEPOSIT';
export const ACTION_SKIP = 'SKIP';
export const ACTION_CREATE_GROUP = 'CREATE_GROUP';


export const chanceDeposit = 50;
export const chanceWithdraw = 10;
export const chanceBuyShares = 50;
export const chanceSellShares = 0;
export const chanceCreateGroup = 10;

const hasAction = (history: string[], action: string) => {
    return history.includes(action);
}

export const decideUserAction = (
    history: string[],
    people: HDNodeWallet[],
    uid: number, // people index possibly just to know wallet # or something
    currentTick: number, // can be hour by default or something else, we're using hours
    maxTicks: number,
    strategy: number,
    memory: { [key: string]: any }
) => {


    const lastAction = history[history.length - 1];
    const lastActionIsSkip = lastAction === ACTION_SKIP;


    /**
     * Pre-handle strategies here
     */

    if (strategy === 2) {

        if (currentTick === 0) {
            return ACTION_DEPOSIT; // first user will deposit
        }

        if (currentTick === 1) {
            if (uid === 0) {
                return ACTION_BUY_SHARES;
            }
            return ACTION_SKIP;
        }

        if (currentTick >= 2 && currentTick < 5) {
            if (uid !== 0) {
                return ACTION_BUY_SHARES;
            } else {
                return ACTION_SKIP; // skip after bought 1 share for first user
            }
        }

        if (currentTick >= 5) {
            if (uid === 0) {
                return ACTION_SKIP; // first user will keep share for a while
            } else {
                return ACTION_SELL_SHARES; // others will sell shares 50% for first time 
            }
        }

        return ACTION_SELL_SHARES;
    }

    if (strategy === 3) {
        if (currentTick === 0) {
            return ACTION_DEPOSIT; // first user will deposit
        }

        if (currentTick === 1) {
            if (uid === 0) {
                return ACTION_BUY_SHARES;
            }
            return ACTION_SKIP;
        }

        if (currentTick === 2) {
            if (uid === 0) {
                return ACTION_SKIP;
            }

            return ACTION_BUY_SHARES;
        }

        if (currentTick === 3) {
            if (uid === 0) {
                console.warn(`UID0 SELL SHARES`);
                return ACTION_SELL_SHARES;
            }

            return ACTION_SKIP;
        }

        return ACTION_SKIP;
    }

    if (strategy === 4) {
        if (currentTick === 0) {
            if (uid === 0) {
                return ACTION_BUY_SHARES;
            }
            return ACTION_DEPOSIT;
        }

        if (currentTick === 1) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return randomInt(1, 100) < 30 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 2) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return hasAction(history, ACTION_BUY_SHARES) ? ACTION_SKIP : randomInt(1, 100) < 40 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 3) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return hasAction(history, ACTION_BUY_SHARES) ? ACTION_SKIP : randomInt(1, 100) < 50 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 4) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return hasAction(history, ACTION_BUY_SHARES) ? ACTION_SKIP : randomInt(1, 100) < 60 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 5) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return hasAction(history, ACTION_BUY_SHARES) ? ACTION_SKIP : randomInt(1, 100) < 70 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 6) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            return hasAction(history, ACTION_BUY_SHARES) ? ACTION_SKIP : randomInt(1, 100) < 80 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick >= 7) {
            return ACTION_SKIP;
        }

        return ACTION_SKIP;
    }

    if (strategy === 5) {
        if (currentTick === 0) {
            if (uid === 0) {
                return ACTION_BUY_SHARES;
            }

            return ACTION_SKIP;
        }

        if (currentTick === 1) {
            if (uid === 0) {
                return ACTION_SKIP;
            }
            if (uid >= 1 && uid <= 24) {
                return ACTION_BUY_SHARES;
            }

            return ACTION_SKIP;
        }

        if (currentTick === 2) {
            if (uid === 0) {
                return ACTION_SELL_SHARES;
            }
            return ACTION_SKIP;
        }

        if (currentTick >= 3) {
            return ACTION_SKIP;
        }

        return ACTION_SKIP; // fallback anyways. 
    }

    if (strategy === 6) {
        if (currentTick === 0) {
            return uid === 0 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }
        if (currentTick >= 1 && currentTick <= 8) {
            return ACTION_SKIP;
        }

        if (currentTick === 9) {
            return uid === 0 ? ACTION_SELL_SHARES : ACTION_SKIP;
        }

        return ACTION_SKIP;
    }

    if (strategy === 7) {
        if (currentTick === 0) {
            return uid === 0 ? ACTION_BUY_SHARES : ACTION_SKIP;
        }

        if (currentTick === 1 || currentTick === 2) {
            return ACTION_SKIP;
        }

        if (currentTick === 3) {
            return uid === 0 ? ACTION_SELL_SHARES : ACTION_SKIP;
        }

        return ACTION_SKIP;
    }

    // default handlers

    if (history.length === 0) {
        return randomInt(100) < 70 ? ACTION_DEPOSIT : ACTION_SKIP; // 70% chance to deposit
    }

    // if (lastActionIsSkip && randomInt(100) < chanceCreateGroup) {
    //     //return ACTION_CREATE_GROUP; // last action was skip
    // }

    if (lastActionIsSkip) {
        return randomInt(100) < chanceDeposit ? ACTION_DEPOSIT : ACTION_SKIP;
    }

    const lastActionIsDeposit = lastAction === ACTION_DEPOSIT;
    const lastActionIsWithdraw = lastAction === ACTION_WITHDRAW;

    if (lastActionIsDeposit) {
        return randomInt(100) < chanceBuyShares ? ACTION_BUY_SHARES : ACTION_SKIP;
    }

    if (lastActionIsWithdraw) {
        return randomInt(100) < chanceBuyShares ? ACTION_BUY_SHARES : ACTION_SKIP;
    }

    if (lastAction === ACTION_SKIP || lastAction === ACTION_CREATE_GROUP || lastAction === ACTION_BUY_SHARES) {
        return randomInt(100) < chanceSellShares ? ACTION_SELL_SHARES : ACTION_BUY_SHARES;
    }

    const lastActionIsSellShares = lastAction === ACTION_SELL_SHARES;

    if (lastActionIsSellShares && randomInt(100) < chanceWithdraw) {
        return ACTION_WITHDRAW;
    }



    return ACTION_SKIP;
};


export const intToBn = (num: number) => {
    return ethers.parseEther(num.toString());
}

export const eth2Human = (eth: BigNumberish) => {
    return ethers.formatEther(eth);
}


export const snapShotBank = async (bank: SuperDapp, owner: Signer, wallets: HDNodeWallet[], groupsPool: { [key: string]: BigNumberish }) => {
    return {
        protocolOwnerBalance: eth2Human(await bank.balanceOf(await owner.getAddress())),
        totalGroups: Object.keys(groupsPool).length,
        walletsBalances: await Promise.all(
            wallets.map(async (wallet, idx) => {
                return {
                    idx: idx,
                    address: await wallet.getAddress(),
                    balance: eth2Human(await bank.balanceOf(await wallet.getAddress()))
                }
            })
        )
    }
}


export const snapShotPotentialProfits = async (tokensPool: { [key: string]: string[] }, bank: SuperDapp, soldShares: number[], people: HDNodeWallet[] = []) => {
    return Promise.all(Object.keys(tokensPool).map(async (walletAddress) => {
        const tokenIds = tokensPool[walletAddress];
        const walletSigner = people.find((person) => person.address === walletAddress);
        return {
            walletAddress: walletAddress,
            totalBought: tokenIds.length,
            potentialProfits: await Promise.all(tokenIds.map(async (tokenId) => {

                // @ts-ignore
                const buyPrice = await bank.tokenInitialPrices(tokenId);

                if (soldShares.includes(parseInt(tokenId))) {


                    return {
                        tokenId: tokenId,
                        potentialProfit: 0,
                        buyPrice: eth2Human(buyPrice),
                    }
                }

                try {
                    // @ts-ignore
                    const profitEstTx = await bank.connect(walletSigner).sellShares.staticCall(tokenId);

                    return {
                        tokenId: tokenId,
                        potentialProfit: eth2Human(profitEstTx[2]),
                        buyPrice: eth2Human(buyPrice),
                    }
                } catch (e) {
                    // @ts-ignore

                    console.log('error', e.message, tokenId);

                    return {
                        tokenId: tokenId,
                        potentialProfit: 0,
                        buyPrice: eth2Human(buyPrice),
                    }
                }
            }))
        };
    }));
}

export const snapShotTokenBalance = async (token: SuperDappToken, wallets: HDNodeWallet[]) => {
    return await Promise.all(
        wallets.map(async (wallet, idx) => {
            return {
                idx: idx,
                address: await wallet.getAddress(),
                balance: eth2Human(await token.balanceOf(await wallet.getAddress()))
            }
        })
    )
}


export const proposeGroup = (groupsPool: { [key: number | string]: BigNumberish }) => {
    const keys: string[] = Object.keys(groupsPool);
    const selected = keys[keys.length * Math.random() << 0];

    return {
        'id': selected,
        'minJoinAmount': groupsPool[selected]
    };
}