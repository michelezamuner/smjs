const Container = require('container').Container;
const Provider = require('./Provider');
const Parser = require('command-line-parser').CommandLineParser;
const RunProgramController = require('../adapters/sloth-machine/run_program/Controller');
const Request = require('../adapters/sloth-machine/run_program/Request');
const AppException = require('./AppException');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

module.exports = class App {
    static get DEFAULT_ARCHITECTURE() { return 'sma'; }
    static get CLI_ARG_ARCHITECTURE() { return 'arc'; }

    /**
     * @param {Container} container
     * @param {Provider} provider
     */
    constructor(container, provider) {
        this._container = container;
        this._provider = provider;
    }

    /**
     * @param {Parser} parser
     */
    run(parser) {
        this._provider.register(this._container);

        const architecture = parser.getArgument(App.CLI_ARG_ARCHITECTURE) || App.DEFAULT_ARCHITECTURE;
        const file = parser.getArgument();
        if (file === null) {
            throw new AppException('No program file given');
        }

        const controller = this._container.make(RunProgramController);
        const request = new Request(architecture, file);

        try {
            controller.runProgram(request);
        } catch (e) {
            if (e instanceof UnsupportedArchitectureException) {
                throw new AppException(`Cannot find selected architecture "${e.getArchitectureName()}"`);
            }
            if (e instanceof InvalidArchitectureException) {
                throw new AppException(`Selected architecture "${e.getArchitectureName()}" has invalid implementation`);
            }
            if (e instanceof InvalidProgramException) {
                throw new AppException(`Invalid program file given: "${e.getProgramReference()}"`);
            }

            throw e;
        }
    }
};
