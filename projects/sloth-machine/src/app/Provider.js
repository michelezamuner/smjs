const Container = require('container').Container;
const ArchitectureDirectoryProvider = require('../adapters/cli/architecture/ArchitecturesDirectoryProvider');
const ArchitectureLoaderInterface = require('core').ArchitectureLoader;
const ProgramLoader = require('core').ProgramLoader;
const ArchitectureLoader = require('../adapters/cli/architecture/LocalArchitectureLoader');
const FileProgramLoader = require('../adapters/cli/architecture/FileProgramLoader');

module.exports = class Provider {
    /**
     * @param {Container} container
     */
    register(container) {
        const config = container.make('config');

        container.bind(ArchitectureDirectoryProvider, new ArchitectureDirectoryProvider(config.mods));
        container.bind(ArchitectureLoaderInterface, ArchitectureLoader);
        container.bind(ProgramLoader, new FileProgramLoader(container.make('app.file')));
    }
};
