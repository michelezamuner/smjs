const Provider = require('./Provider');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const Logger = require('logger').Logger;
const ConsoleHandler = require('logger').ConsoleHandler;
const FileHandler = require('logger').FileHandler;
const Console = require('console-wrapper').Console;
const ErrorHandlerFailed = require('../../src/ErrorHandlerFailed');
const ErrorReceived = require('app/core').handle_error.messages.ErrorReceived;
const ApplicationFailed = require('app/virtual-machine').run_program.messages.ApplicationFailed;
const ArchitectureLoaded = require('app/virtual-machine').run_program.messages.ArchitectureLoaded;
const ExecutionTerminated = require('app/virtual-machine').run_program.messages.ExecutionTerminated;
const ProgramLoaded = require('app/virtual-machine').run_program.messages.ProgramLoaded;

module.exports = class SlothMachine_Providers_LoggerProvider extends Provider {
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
        const config = this._container.make('config');
        const bus = this._container.make(MessageBus);

        const error = new Logger();
        error.addHandler(new FileHandler(config.logs + '/error.log'));
        if (config.env === 'dev') {
            error.addHandler(new ConsoleHandler(this._container.make(Console), ConsoleHandler.STREAM_STDERR));
        }

        bus.register([ErrorReceived, ErrorHandlerFailed], msg => error.log(msg.getError().stack));
        bus.register([ApplicationFailed], msg => error.log(config.debug ? msg.getError().stack : msg.getError().message));

        if (config.debug) {
            const debug = new Logger();
            debug.addHandler(new FileHandler(config.logs + '/debug.log'));
            bus.register([ErrorReceived, ApplicationFailed], msg => debug.log(msg.getError().stack));
            bus.register([ArchitectureLoaded], msg => debug.log(`Loaded architecture ${msg.getArchitectureName()}`));
            bus.register([ExecutionTerminated], msg => debug.log(`Execution terminated with exit status ${msg.getExitStatus().format()}`));
            bus.register([ProgramLoaded], msg => debug.log(`Loaded program ${msg.getProgramReference()}`));
        }
    }
};
