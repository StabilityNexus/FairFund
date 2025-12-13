// Mocks to run before modules are imported

// Mock wagmi hooks used in components
jest.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: false }),
  useWalletClient: () => ({ data: null }),
  useChainId: () => undefined,
}));

// Mock @reown/appkit react hook used for wallet modal
jest.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: jest.fn() }),
}));

// Mock lucide-react icons (ESM) to prevent ESM parsing issues in Jest
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (_target, prop) => {
      if (prop === '__esModule') return true;
      return (props) => React.createElement('svg', { ...props, 'data-icon': String(prop) });
    },
  });
});
