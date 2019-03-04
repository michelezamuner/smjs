const MissingProgramReferenceException = require('./MissingProgramReferenceException');
const ProcessorFactory = require('./ProcessorFactory');
const AdapterDependencies = require('./AdapterDependencies');
const Request = require('./Request');
const Response = require('./Response');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const ProcessorException = require('domain/sloth-machine-framework').processor.ProcessorException;
const ArchitectureLoaded = require('./messages/ArchitectureLoaded');
const ProgramLoaded = require('./messages/ProgramLoaded');
const ExecutionTerminated = require('./messages/ExecutionTerminated');
const ApplicationFailed = require('./messages/ApplicationFailed');

module.exports = class RunProgram {
    static get __DEPS__() { return [ AdapterDependencies, ProcessorFactory ]; }

    /**
     * @param {AdapterDependencies} adapter
     * @param {ProcessorFactory} processorFactory
     */
    constructor(adapter, processorFactory) {
        this._processorFactory = processorFactory;
        this._presenter = adapter.getPresenter();
        this._architectureLoader = adapter.getArchitectureLoader();
        this._programLoader = adapter.getProgramLoader();
        this._system = adapter.getSystem();
        this._bus = adapter.getMessageBus();
    }

    /**
     * @param {Request} request
     */
    run(request) {
        try {
            if (request.getProgramReference() === null) {
                const error = new MissingProgramReferenceException();
                this._bus.send(new ApplicationFailed(error));
                this._presenter.present(new Response(null, error));

                return;
            }

            const architecture = this._architectureLoader.load(request.getArchitectureName());
            this._bus.send(new ArchitectureLoaded(architecture, request.getArchitectureName()));

            const interpreter = architecture.getInterpreter(this._system);
            const processor = this._processorFactory.create(interpreter);

            const program = this._programLoader.load(request.getProgramReference());
            this._bus.send(new ProgramLoaded(program, request.getProgramReference()));

            const exitStatus = processor.run(program);
            this._bus.send(new ExecutionTerminated(exitStatus));

            this._presenter.present(new Response(exitStatus));
        } catch (e) {
            if (!this._isApplicationError(e)) {
                throw e;
            }

            this._bus.send(new ApplicationFailed(e));
            this._presenter.present(new Response(null, e));
        }
    }

    /**
     * @param {Error} error
     * @return {boolean}
     * @private
     */
    _isApplicationError(error) {
        return error instanceof UnsupportedArchitectureException ||
            error instanceof InvalidArchitectureException ||
            error instanceof InvalidProgramException ||
            error instanceof ProcessorException;
    }
};
