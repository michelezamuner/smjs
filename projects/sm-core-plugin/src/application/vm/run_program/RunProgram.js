const ArchitectureLoader = require('../../architecture/ArchitectureLoader');
const Request = require('./Request');
const UnsupportedArchitectureException = require('../../../domain/smf/architecture/UnsupportedArchitectureException');

module.exports = class RunProgram {
    static get __DEPS__() { return [ ArchitectureLoader ]; }

    /**
     * @param {ArchitectureLoader} loader
     */
    constructor(loader) {
        this._architectureLoader = loader;
    }

    /**
     * @param {Request} request
     * @throws UnsupportedArchitectureException
     */
    run(request) {
        const architectureName = request.getArchitecture();
        const architecture = this._architectureLoader.load(architectureName);

        // @todo: implement this
    }
};
