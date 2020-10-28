module.exports = {
  verbose: false,
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    'settings.json': '<rootDir>/config/settings.json',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/coverage/'],
  coverageReporters: ['text', 'text-summary'],
}
