const Container = require('container').Container;
const Parser = require('command-line-parser').CommandLineParser;
const RunProgramController = require('../adapters/sloth_machine/run_program/Controller');
const Request = require('../adapters/sloth_machine/run_program/Request');
const Console = require('../adapters/sloth_machine/run_program/Console');
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
        const console = this._container.make(Console);
        const architecture = parser.getArgument(App.CLI_ARG_ARCHITECTURE) || App.DEFAULT_ARCHITECTURE;
        const file = parser.getArgument();
        if (file === null) {
            console.exit('No program file given', 127);
        }

        const controller = this._container.make(RunProgramController);
        const request = new Request(architecture, file);

        try {
            controller.runProgram(request);
        } catch (e) {
            if (e instanceof UnsupportedArchitectureException) {
                console.exit(`Cannot find selected architecture "${e.getArchitectureName()}"`, 127);
            }
            if (e instanceof InvalidArchitectureException) {
                console.exit(`Selected architecture "${e.getArchitectureName()}" has invalid implementation`, 127);
            }
            if (e instanceof InvalidProgramException) {
                console.exit(`Invalid program file given: ${e.message}`, 127);
            }

            console.exit(e, 127);
        }
    }
};
