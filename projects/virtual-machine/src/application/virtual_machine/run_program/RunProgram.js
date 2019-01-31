const ProcessorFactory = require('./ProcessorFactory');
const Presenter = require('./Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const ProgramLoader = require('program-loader').ProgramLoader;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const System = require('architecture-loader').System;
const ProcessorException = require('sloth-machine-framework').ProcessorException;
const Request = require('./Request');
const Response = require('./Response');

module.exports = class RunProgram {
    static get __DEPS__() { return [ ProcessorFactory, Presenter, ArchitectureLoader, ProgramLoader, System ]; }

    /**
     * @param {ProcessorFactory} processorFactory
     * @param {Presenter} presenter
     * @param {ArchitectureLoader} architectureLoader
     * @param {ProgramLoader} programLoader
     * @param {System} system
     */
    constructor(processorFactory, presenter, architectureLoader, programLoader, system) {
        this._processorFactory = processorFactory;
        this._presenter = presenter;
        this._architectureLoader = architectureLoader;
        this._programLoader = programLoader;
        this._system = system;
    }

    /**
     * @param {Request} request
     * @throws UnsupportedArchitectureException
     * @throws InvalidArchitectureException
     * @throws InvalidProgramException
     * @throws ProcessorException
     */
    run(request) {
        const architecture = this._architectureLoader.load(request.getArchitectureName());
        const interpreter = architecture.getInterpreter(this._system);
        const processor = this._processorFactory.create(interpreter);

        const program = this._programLoader.load(request.getProgramReference());
        const exitStatus = processor.run(program);
        this._presenter.present(new Response(exitStatus));
    }
};
