const Provider = require('./Provider');
const Container = require('container').Container;
const Console = require('console-wrapper').Console;
const NativeConsole = require('console-wrapper').NativeConsole;
const FileReader = require('adapters/file-program-loader').FileReader;
const NativeFileReader = require('adapters/file-program-loader').NativeFileReader;
const ProgramLoader = require('app/program-loader').ProgramLoader;
const FileProgramLoader = require('adapters/file-program-loader').FileProgramLoader;
const ModuleLoader = require('adapters/local-architecture-loader').ModuleLoader;
const NativeModuleLoader = require('adapters/local-architecture-loader').NativeModuleLoader;
const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const LocalArchitectureLoader = require('adapters/local-architecture-loader').LocalArchitectureLoader;
const System = require('app/system').System;
const OSSystem = require('adapters/os-system').OSSystem;
const Filesystem = require('adapters/os-system').Filesystem;
const NativeFilesystem = require('adapters/os-system').NativeFilesystem;

module.exports = class SlothMachine_Providers_SlothMachineProvider extends Provider {
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
        this._container.bind(Console, NativeConsole);
        this._container.bind(FileReader, NativeFileReader);
        this._container.bind(ProgramLoader, FileProgramLoader);
        this._container.bind(ModuleLoader, NativeModuleLoader);
        this._container.bind('adapters.local_architecture_loader.path', this._container.make('config').mods);
        this._container.bind(ArchitectureLoader, LocalArchitectureLoader);
        this._container.bind(System, OSSystem);
        this._container.bind(Filesystem, NativeFilesystem);
    }
};
