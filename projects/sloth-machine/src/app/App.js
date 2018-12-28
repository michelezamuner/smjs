const Container = require('./Container');
const AppConfig = require('./AppConfig');
const RunProgramController = require('../adapters/cli/vm/run_program/Controller');
const Request = require('../adapters/cli/vm/run_program/Request');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

module.exports = class App {
    /**
     * @param {Container} container
     */
    constructor(container) {
        this._container = container;
    }

    /**
     * @param {AppConfig} config
     */
    run(config) {
        const controller = this._container.make(RunProgramController);
        try {
            const request = new Request(config.getArchitecture());
            controller.run(request);
        } catch (e) {
            if (e.constructor === UnsupportedArchitectureException) {
                throw new Error(`Unsupported architecture "${e.getArchitecture()}"`);
            }
        }
    }
};
