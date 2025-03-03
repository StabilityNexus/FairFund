export const mordor = {
    id: 63,
    name: 'Ethereum Classic Mordor Testnet',
    network: 'ethereum-classic-mordor',
    nativeCurrency: {
      name: 'Ethereum Classic',
      symbol: 'ETC',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.mordor.etccooperative.org'],
      },
      public: {
        http: ['https://rpc.mordor.etccooperative.org'],
      },
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: 'https://blockscout.com/etc/mordor' },
    },
    testnet: true,
  };
  