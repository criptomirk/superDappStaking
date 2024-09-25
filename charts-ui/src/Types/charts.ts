export type BankSnapShotItemWalletBalance = {
  idx: number;
  address: string;
  balance: string;
};

export type BankSnapShotItem = {
  protocolOwnerBalance: string;
  totalGroups: number;
  walletsBalances: BankSnapShotItemWalletBalance[];
};

export type BankSnapShotArray = BankSnapShotItem[];

export type PotentialProfitItem = {
  buyPrice: any;
  tokenId: string;
  potentialProfit: string;
};

export type PotentialProfitArray = PotentialProfitItem[];

export type PotentialProfitUserItem = {
  walletAddress: string;
  totalBought: number;
  potentialProfits: PotentialProfitArray;
};

export type PotentialProfitsData = PotentialProfitUserItem[];

export type TokenSnapshot = {
  idx: number;
  address: string;
  balance: string;
};

export type TokenSnapshotArray = TokenSnapshot[];

export type TokenSnapshotsData = TokenSnapshotArray[];
