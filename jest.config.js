const esModules = ['@angular', 'zone', 'dayjs'];

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/tests/test.setup.js'],
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

    collectCoverageFrom: [
        'src/app/**/*.ts',
        '!src/app/**/*.module.ts',      // skip NgModules
        '!src/app/**/*.factory.ts',     // skip Factories
        '!src/app/**/*.routing.ts',     // skip routing
        '!src/app/main.ts',             // entrypoint
        '!src/app/**/*.spec.ts',        // skip test files
        '!src/app/**/reducers.ts',      // skip reducers
        '!src/app/app.component.ts',    // skip app component
    ],

    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['html', 'lcov', 'text'],

    // optional: enforce minimum thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 80,
            statements: 80
        }
    }

};
