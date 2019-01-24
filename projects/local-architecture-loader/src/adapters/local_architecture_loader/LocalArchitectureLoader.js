const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const Architecture = require('framework').Architecture;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const ModuleLoader = require('./ModuleLoader');
const ModuleLoaderException = require('./ModuleLoaderException');

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
     * @inheritDoc
     */
    load(name) {
        const architectureClass = this._getArchitectureClass(name);
        if (!(architectureClass.prototype instanceof Architecture)) {
            throw new InvalidArchitectureException(name);
        }

        return new architectureClass();
    }

    /**
     * @param {string} name
     * @return {Object}
     * @private
     * @throws {UnsupportedArchitectureException}
     */
    _getArchitectureClass(name) {
        const architectureDir = this._architecturesDirectory + '/' + name;
        try {
            return this._moduleLoader.load(architectureDir + '/lib');
        } catch (e) {
            if (e instanceof ModuleLoaderException) {
                throw new UnsupportedArchitectureException(name);
            }
            throw e;
        }
    }
};
