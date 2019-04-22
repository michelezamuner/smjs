const config = {
    roots: ['./tests'],
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: '/tmp',
    coveragePathIgnorePatterns: [
        'acceptance/',
        'messages/',
        'Provider\.js',
        'Actuator\.js',
        'MessageBus\.js',
        '/Signal\.js',
        'NativeWriter\.js',
        'Writer\.js',
        'NativeServer\.js',
        'Notifier\.js',
        'Request\.js',
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
