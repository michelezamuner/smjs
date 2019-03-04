const config = {
    roots: ['./tests'],
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: '/tmp',
    coveragePathIgnorePatterns: [
        'ModuleLoader\.js',
        'NativeModuleLoader\.js',
    ],
    coverageReporters: ['text'],
};

if (process.env.JEST_ENV === 'ci') {
    config.bail = true;
    config.verbose = false;
    config.coverageReporters = [];
    config.coverageThreshold = {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        }
    };
}

module.exports = config;
