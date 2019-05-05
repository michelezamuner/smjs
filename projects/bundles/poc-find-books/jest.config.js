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
        'clients/SearchBooksClient\.js',
        'service-application/ApplicationWidgetFactory\.js',
        'service-application/input-parser/InputParser\.js',
        'service-application/input-parser/ServiceRequest\.js',
        'service-application/server/Connection\.js',
        'service-application/server/ConnectionListener\.js',
        'service-application/server/Server\.js',
        'service-application/server/ServerFactory\.js',
        'service-application/widgets/WidgetDeps\.js',
        'service-application/widgets/ApplicationWidgetDeps\.js',
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
