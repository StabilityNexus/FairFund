const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest.mocks.js'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^lucide-react(.*)$': '<rootDir>/__mocks__/lucide-react.js',
    '^@reown/appkit/react$': '<rootDir>/__mocks__/@reown-appkit-react.js',
  },
};

module.exports = createJestConfig(customJestConfig);

