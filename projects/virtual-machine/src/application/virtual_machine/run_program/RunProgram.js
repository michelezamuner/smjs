const MissingProgramReferenceException = require('./MissingProgramReferenceException');
const ProcessorFactory = require('./ProcessorFactory');
const AdapterDependencies = require('./AdapterDependencies');
const Request = require('./Request');
const Response = require('./Response');

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
    }

    /**
     * @param {Request} request
     */
    run(request) {
        try {
            if (request.getProgramReference() === null) {
                this._presenter.present(new Response(null, new MissingProgramReferenceException()));

                return;
            }
            const architecture = this._architectureLoader.load(request.getArchitectureName());
            const interpreter = architecture.getInterpreter(this._system);
            const processor = this._processorFactory.create(interpreter);

            const program = this._programLoader.load(request.getProgramReference());
            const exitStatus = processor.run(program);
            this._presenter.present(new Response(exitStatus));
        } catch (e) {
            this._presenter.present(new Response(null, e));
        }
    }
};
