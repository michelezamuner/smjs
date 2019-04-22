const config = {
    roots: ['./tests'],
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: '/tmp',
    coveragePathIgnorePatterns: [
        'acceptance/',
        'api_gateway/search_books/Presenter\.js',
        'api_gateway/search_books/Request\.js',
        'api_gateway/search_books/Response\.js',
        'clients/SearchBooksClient\.js'
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
