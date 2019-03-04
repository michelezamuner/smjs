const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;
const InvalidArchitectureException = require('app/architecture-loader').InvalidArchitectureException;
const UnsupportedArchitectureException = require('app/architecture-loader').UnsupportedArchitectureException;
const ModuleLoader = require('./ModuleLoader');
const CannotFindModuleException = require('./CannotFindModuleException');

module.exports = class LocalArchitectureLoader extends ArchitectureLoader {
    static get __DEPS__() { return [ModuleLoader, 'adapters.local_architecture_loader.path']; }

    /**
     * @param {ModuleLoader} moduleLoader
     * @param {string} architecturesDirectory
     */
    constructor(moduleLoader, architecturesDirectory) {
        super();
        this._moduleLoader = moduleLoader;
        this._architecturesDirectory = architecturesDirectory;
    }

    /**
     * @override
     */
    load(name) {
        const architecture = this._getArchitecture(name);
        if (!(architecture instanceof Architecture)) {
            throw new InvalidArchitectureException(name);
        }

        return architecture;
    }

    /**
     * @param {string} name
     * @return {Object}
     * @private
     * @throws {UnsupportedArchitectureException}
     */
    _getArchitecture(name) {
        const architectureDir = this._architecturesDirectory + '/' + name;
        try {
            return this._moduleLoader.load(architectureDir + '/lib');
        } catch (e) {
            if (e instanceof CannotFindModuleException) {
                throw new UnsupportedArchitectureException(name);
            }
            throw e;
        }
    }
};
