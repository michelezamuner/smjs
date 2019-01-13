const Container = require('container').Container;
const fs = require('fs');
const ProgramLoader = require('core').ProgramLoader;
const FileProgramLoader = require('../adapters/cli/architecture/FileProgramLoader');
const FileReader = require('../adapters/cli/architecture/FileReader');
const FileReaderException = require('../adapters/cli/architecture/FileReaderException');
const ModuleLoader = require('../adapters/cli/architecture/ModuleLoader');
const ModuleLoaderException = require('../adapters/cli/architecture/ModuleLoaderException');
const ArchitectureLoaderInterface = require('core').ArchitectureLoader;
const ArchitectureLoader = require('../adapters/cli/architecture/LocalArchitectureLoader');

module.exports = class Provider {
    /**
     * @param {Container} container
     */
    register(container) {
        container.bind(FileReader, {
            read: (file, options) => {
                try {
                    return fs.readFileSync(file, options);
                } catch (e) {
                    throw new FileReaderException(e.message);
                }
            }
        });
        container.bind('adapters.cli.architecture.program_file', container.make('app.file'));
        container.bind(ProgramLoader, FileProgramLoader);

        container.bind(ModuleLoader, {
            load: (module => {
                try {
                    return require(module);
                } catch (e) {
                    throw new ModuleLoaderException(e.message);
                }
            })
        });
        container.bind('adapters.cli.architecture.architectures_directory', container.make('config').mods);
        container.bind(ArchitectureLoaderInterface, ArchitectureLoader);
    }
};
