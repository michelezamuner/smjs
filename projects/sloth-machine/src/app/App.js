const Container = require('container').Container;
const Parser = require('command-line-parser').CommandLineParser;
const RunProgramController = require('../adapters/sloth-machine/run_program/Controller');
const Request = require('../adapters/sloth-machine/run_program/Request');
const System = require('./System');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

module.exports = class App {
    static get DEFAULT_ARCHITECTURE() { return 'sma'; }
    static get CLI_ARG_ARCHITECTURE() { return 'arc'; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        this._container = container;
    }

    run() {
        const parser = this._container.make(Parser);
        const architecture = parser.getArgument(App.CLI_ARG_ARCHITECTURE) || App.DEFAULT_ARCHITECTURE;
        const file = parser.getArgument();
        if (file === null) {
            this._fail('No program file given');
        }

        const controller = this._container.make(RunProgramController);
        const request = new Request(architecture, file);

        try {
            controller.runProgram(request);
        } catch (e) {
            if (e instanceof UnsupportedArchitectureException) {
                this._fail(`Cannot find selected architecture "${e.getArchitectureName()}"`);
            }
            if (e instanceof InvalidArchitectureException) {
                this._fail(`Selected architecture "${e.getArchitectureName()}" has invalid implementation`);
            }
            if (e instanceof InvalidProgramException) {
                this._fail(`Invalid program file given: "${e.getProgramReference()}"`);
            }

            this._fail(e.toString());
        }
    }

    /**
     * @param {string} text
     * @private
     */
    _fail(text) {
        if (this._system === undefined) {
            this._system = this._container.make(System);
        }
        this._system.exit(text, 127);
    }
};
