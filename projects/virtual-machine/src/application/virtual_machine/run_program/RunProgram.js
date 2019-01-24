const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const ProgramLoader = require('program-loader').ProgramLoader;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const System = require('architecture-loader').System;
const Request = require('./Request');

module.exports = class RunProgram {
    static get __DEPS__() { return [ ArchitectureLoader, ProgramLoader, System ]; }

    /**
     * @param {ArchitectureLoader} architectureLoader
     * @param {ProgramLoader} programLoader
     * @param {System} system
     */
    constructor(architectureLoader, programLoader, system) {
        this._architectureLoader = architectureLoader;
        this._programLoader = programLoader;
        this._system = system;
    }

    /**
     * @param {Request} request
     * @throws UnsupportedArchitectureException
     * @throws InvalidArchitectureException
     * @throws InvalidProgramException
     */
    run(request) {
        const architecture = this._architectureLoader.load(request.getArchitectureName());
        const interpreter = architecture.getInterpreter(this._system);

        const program = this._programLoader.load(request.getProgramReference());
        // @todo: implement this
    }
};
