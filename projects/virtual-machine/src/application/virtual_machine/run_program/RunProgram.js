const MissingProgramReferenceException = require('./MissingProgramReferenceException');
const ProcessorFactory = require('./ProcessorFactory');
const Presenter = require('./Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('architecture-loader').System;
const Request = require('./Request');
const SuccessResponse = require('./SuccessResponse');
const ErrorResponse = require('./ErrorResponse');

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
     */
    run(request) {
        try {
            if (request.getProgramReference() === null) {
                throw new MissingProgramReferenceException();
            }
            const architecture = this._architectureLoader.load(request.getArchitectureName());
            const interpreter = architecture.getInterpreter(this._system);
            const processor = this._processorFactory.create(interpreter);

            const program = this._programLoader.load(request.getProgramReference());
            const exitStatus = processor.run(program);
            this._presenter.present(new SuccessResponse(exitStatus));
        } catch (e) {
            this._presenter.present(new ErrorResponse(e));
        }
    }
};
