export default {
  preset: 'ts-jest',
  // testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest', // Esto debería incluir archivos .tsx
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'], // Asegúrate de incluir .tsx
  testMatch: ['**/src/**/*.test.(ts|tsx)'], // Incluye archivos de prueba .tsx
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '/node_modules/(?!@mui/x-date-pickers)/',  // Add this line to include the MUI package
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testTimeout: 50000,
  testEnvironment: 'node',
};