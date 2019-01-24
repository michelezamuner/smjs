const Container = require('container').Container;
const ProgramLoader = require('program-loader').ProgramLoader;
const FileProgramLoader = require('file-program-loader').FileProgramLoader;
const FileReader = require('file-program-loader').FileReader;
const NativeFileReader = require('file-program-loader').NativeFileReader;
const ModuleLoader = require('local-architecture-loader').ModuleLoader;
const NativeModuleLoader = require('local-architecture-loader').NativeModuleLoader;
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const LocalArchitectureLoader = require('local-architecture-loader').LocalArchitectureLoader;

module.exports = class Provider {
    /**
     * @param {Container} container
     */
    register(container) {
        container.bind(FileReader, NativeFileReader);
        container.bind(ProgramLoader, FileProgramLoader);
        container.bind(ModuleLoader, NativeModuleLoader);
        container.bind('adapters.local_architecture_loader.path', container.make('config').mods);
        container.bind(ArchitectureLoader, LocalArchitectureLoader);
    }
};
