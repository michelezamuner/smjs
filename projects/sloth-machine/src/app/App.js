const Container = require('container').Container;
const Provider = require('./Provider');
const Parser = require('parser').CommandLineParser;
const RunProgramController = require('../adapters/cli/vm/run_program/Controller');
const Request = require('../adapters/cli/vm/run_program/Request');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const ProgramLoaderException = require('core').ProgramLoaderException;
const AppException = require('./AppException');

module.exports = class App {
    static get DEFAULT_ARCHITECTURE() { return 'sma'; }
    static get CLI_ARG_ARCHITECTURE() { return 'arc'; }

    /**
     * @param {Container} container
     * @param {Provider} provider
     * @param {Parser} parser
     */
    constructor(container, provider, parser) {
        this._container = container;
        this._provider = provider;
        this._parser = parser;
    }

    run() {
        const architecture = this._parser.getArgument(App.CLI_ARG_ARCHITECTURE) || App.DEFAULT_ARCHITECTURE;
        const file = this._parser.getArgument();
        if (file === null) {
            throw new AppException('No program file given');
        }
        this._container.bind('app.file', file);

        this._provider.register(this._container);

        const controller = this._container.make(RunProgramController);
        const request = new Request(architecture);

        try {
            controller.runProgram(request);
        } catch (e) {
            if (e.constructor === UnsupportedArchitectureException) {
                throw new AppException(`Unsupported architecture "${e.getArchitecture()}"`);
            }
            if (e.constructor === ProgramLoaderException) {
                throw new AppException(e.message);
            }

            throw e;
        }
    }
};
