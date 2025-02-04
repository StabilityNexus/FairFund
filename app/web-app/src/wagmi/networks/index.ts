import { AppKitNetwork } from '@reown/appkit/networks';

export const milkomedaTestnet: AppKitNetwork = {
    id: 200101,
    name: 'Milkomeda C1 Testnet',
    rpcUrls: {
        default: {
            http: [process.env.NEXT_PUBLIC_MILKOMEDA_TESTNET_RPC_URL || 'https://rpc-devnet-cardano-evm.c1.milkomeda.com'],
        },
    },
    nativeCurrency: {
        name: 'Wrapped Test ADA',
        symbol: 'mTAda',
        decimals: 18,
    },
    blockExplorers: {
        default: {
            name: 'Milkomeda Explorer',
            url: 'https://explorer-devnet-cardano-evm.c1.milkomeda.com',
        },
    },
};
