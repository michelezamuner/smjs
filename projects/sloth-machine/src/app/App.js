const Container = require('container').Container;
const Provider = require('./Provider');
const Parser = require('parser').CommandLineParser;
const RunProgramController = require('../adapters/cli/vm/run_program/Controller');
const Request = require('../adapters/cli/vm/run_program/Request');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const AppException = require('./AppException');

module.exports = class App {
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
        this._provider.register(this._container);

        const architecture = this._parser.getArgument('arc');
        const controller = this._container.make(RunProgramController);
        try {
            const request = new Request(architecture);
            controller.runProgram(request);
        } catch (e) {
            if (e.constructor === UnsupportedArchitectureException) {
                throw new AppException(`Unsupported architecture "${e.getArchitecture()}"`);
            }

            throw e;
        }
    }
};
