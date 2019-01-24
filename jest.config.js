const config = {
    roots: ['./tests'],
    testEnvironment: "node",
    verbose: true,
    coverageDirectory: '/tmp',
    coveragePathIgnorePatterns: [
        'specs',
    ],
    coverageReporters: ['text'],
};

if (process.env.JEST_ENV === 'ci') {
    config.bail = true;
    config.verbose = false;
    config.coverageReporters = [];
    config.coverageThreshold = {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        }
    };
}

module.exports = config;
