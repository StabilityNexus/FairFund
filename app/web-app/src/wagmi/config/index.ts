import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http, cookieStorage, createStorage } from '@wagmi/core';
import { foundry, polygonAmoy, polygon } from '@reown/appkit/networks';
import { mordor } from '../networks';

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) throw new Error('Project ID is not defined');

export const networks =
  process.env.NEXT_PUBLIC_NETWORK === 'foundry'
    ? [foundry]
    : [polygonAmoy, polygon, mordor];

const networkTransports: Record<number, ReturnType<typeof http>> = {};
networks.forEach((chain) => {
  if (chain.id === foundry.id) {
    networkTransports[chain.id] = http('http://localhost:8545');
    
  } else if (chain.id === polygonAmoy.id) {
    networkTransports[chain.id] = http('https://rpc-amoy.polygon.technology/');

  } else if (chain.id === polygon.id) {
    networkTransports[chain.id] = http('https://polygon.llamarpc.com');

  } else if (chain.id === mordor.id) {
    networkTransports[chain.id] = http('https://rpc.mordor.etccooperative.org');

  }
});

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
  transports: networkTransports,
});

(wagmiAdapter as any).adapterType = 'wagmi';

export const config = wagmiAdapter.wagmiConfig;
