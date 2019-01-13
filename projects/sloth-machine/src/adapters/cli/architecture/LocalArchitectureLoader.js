const ArchitectureLoader = require('core').ArchitectureLoader;
const ProgramLoader = require('core').ProgramLoader;
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const ModuleLoader = require('./ModuleLoader');

module.exports = class LocalArchitectureLoader extends ArchitectureLoader {
    static get __DEPS__() { return [
        ModuleLoader,
        ProgramLoader,
        'adapters.cli.architecture.architectures_directory'
    ]; }

    /**
     * @param {ModuleLoader} moduleLoader
     * @param {ProgramLoader} programLoader
     * @param {string} architecturesDirectory
     */
    constructor(moduleLoader, programLoader, architecturesDirectory) {
        super();
        this._moduleLoader = moduleLoader;
        this._programLoader = programLoader;
        this._architecturesDirectory = architecturesDirectory;
    }

    /**
     * @inheritDoc
     */
    load(name) {
        const architectureDir = this._architecturesDirectory + '/' + name;
        try {
            const architectureFactory = this._moduleLoader.load(architectureDir + '/lib');

            return architectureFactory.create(this._programLoader);
        } catch (e) {
            throw new UnsupportedArchitectureException(name);
        }
    }
};
