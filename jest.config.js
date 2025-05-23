const esModules = ['@angular', 'zone', 'dayjs'];

module.exports = {
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.(ts|html|svg)$': [
            'jest-preset-angular',
            { useESM: true, tsconfig: 'tsconfig.spec.json', stringifyContentPathRegex: '\\.html$' },
        ],
        '^.+\\.(js|mjs)$': 'babel-jest', // Use Babel for JS files
    },
    transformIgnorePatterns: [`node_modules/(?!.*\\.mjs$|${esModules.join('|')})`],
    testPathIgnorePatterns: ['./src/test.ts'],
    testRunner: 'jest-circus/runner',
    setupFilesAfterEnv: ['./tests/test.setup.js'],
};
