const Provider = require('./Provider');
const Container = require('container').Container;
const FileReader = require('file-program-loader').FileReader;
const NativeFileReader = require('file-program-loader').NativeFileReader;
const ProgramLoader = require('program-loader').ProgramLoader;
const FileProgramLoader = require('file-program-loader').FileProgramLoader;
const ModuleLoader = require('local-architecture-loader').ModuleLoader;
const NativeModuleLoader = require('local-architecture-loader').NativeModuleLoader;
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const LocalArchitectureLoader = require('local-architecture-loader').LocalArchitectureLoader;
const System = require('architecture-loader').System;
const OSSystem = require('local-architecture-loader').OSSystem;
const Filesystem = require('local-architecture-loader').Filesystem;
const NativeFilesystem = require('local-architecture-loader').NativeFilesystem;
const MessageBus = require('message-bus').MessageBus;

module.exports = class SlothMachineProvider extends Provider {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        super();
        this._container = container;
    }

    /**
     * @override
     */
    register() {
        this._container.bind(FileReader, NativeFileReader);
        this._container.bind(ProgramLoader, FileProgramLoader);
        this._container.bind(ModuleLoader, NativeModuleLoader);
        this._container.bind('adapters.local_architecture_loader.path', this._container.make('config').mods);
        this._container.bind(ArchitectureLoader, LocalArchitectureLoader);
        this._container.bind(System, OSSystem);
        this._container.bind(Filesystem, NativeFilesystem);
    }
};
