const Container = require('container').Container;
const Console = require('ui-console').Console;
const NativeConsole = require('ui-console').NativeConsole;
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
const VirtualMachinePresenter = require('virtual-machine').Presenter;
const SlothMachinePresenter = require('../adapters/sloth_machine/run_program/presenters/ConsolePresenter/Presenter');
const ApplicationPresenter = require('application').application.application.handle_error.Presenter;
const ConsoleApplicationPresenter = require('../adapters/console_application/handle_error/presenters/console_presenter/Presenter');
const ErrorViewInterface = require('../adapters/console_application/handle_error/presenters/shared_presenter/View');
const ErrorView = require('../adapters/console_application/handle_error/views/ErrorView');

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

        container.bind(ApplicationPresenter, ConsoleApplicationPresenter);
        container.bind(ErrorViewInterface, ErrorView);

        container.bind(FileReader, NativeFileReader);
        container.bind(ProgramLoader, FileProgramLoader);
        container.bind(ModuleLoader, NativeModuleLoader);
        container.bind('adapters.local_architecture_loader.path', this._config.mods);
        container.bind(ArchitectureLoader, LocalArchitectureLoader);
        container.bind(System, OSSystem);
        container.bind(Filesystem, NativeFilesystem);

        container.bind(VirtualMachinePresenter, SlothMachinePresenter);
    }
};
