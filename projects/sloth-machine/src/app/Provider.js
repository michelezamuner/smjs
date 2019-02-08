const Container = require('container').Container;
const Console = require('../adapters/sloth_machine/run_program/views/Console');
const NativeConsole = require('../adapters/sloth_machine/run_program/views/NativeConsole');
const ProgramLoader = require('program-loader').ProgramLoader;
const FileProgramLoader = require('file-program-loader').FileProgramLoader;
const FileReader = require('file-program-loader').FileReader;
const NativeFileReader = require('file-program-loader').NativeFileReader;
const ModuleLoader = require('local-architecture-loader').ModuleLoader;
const NativeModuleLoader = require('local-architecture-loader').NativeModuleLoader;
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const LocalArchitectureLoader = require('local-architecture-loader').LocalArchitectureLoader;
const System = require('architecture-loader').System;
const OSSystem = require('local-architecture-loader').OSSystem;
const Filesystem = require('local-architecture-loader').Filesystem;
const NativeFilesystem = require('local-architecture-loader').NativeFilesystem;
const PresenterInterface = require('virtual-machine').Presenter;
const Presenter = require('../adapters/sloth_machine/run_program/presenter/Presenter');

module.exports = class Provider {
    /**
     * @param {Object} config
     */
    constructor(config) {
        this._config = config;
    }
    /**
     * @param {Container} container
     */
    register(container) {
        container.bind(Console, NativeConsole);
        container.bind(FileReader, NativeFileReader);
        container.bind(ProgramLoader, FileProgramLoader);
        container.bind(ModuleLoader, NativeModuleLoader);
        container.bind('adapters.local_architecture_loader.path', this._config.mods);
        container.bind(ArchitectureLoader, LocalArchitectureLoader);
        container.bind(System, OSSystem);
        container.bind(Filesystem, NativeFilesystem);
        container.bind(PresenterInterface, Presenter);
    }
};
