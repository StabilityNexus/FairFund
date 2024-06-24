declare interface Route {
    icon: any;
    href: string;
    label: string;
}

declare interface SmartContract {
    address: string;
    abi: any;
}

declare interface Vault {
    id: string;
    description: string;
    creatorAddress: string;
    fundingTokenAddress: string;
    vaultAddress: string;
}
