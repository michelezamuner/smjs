const Provider = require('./Provider');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const Logger = require('logger').Logger;
const ConsoleHandler = require('logger').ConsoleHandler;
const FileHandler = require('logger').FileHandler;
const Console = require('ui-console').Console;
const ErrorReceived = require('application').application.application.handle_error.messages.ErrorReceived;
const ApplicationFailed = require('virtual-machine').ApplicationFailed;
const ArchitectureLoaded = require('virtual-machine').ArchitectureLoaded;
const ExecutionTerminated = require('virtual-machine').ExecutionTerminated;
const ProgramLoaded = require('virtual-machine').ProgramLoaded;

module.exports = class LoggerProvider extends Provider {
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

        bus.register([ErrorReceived], msg => error.log(msg.getError().stack));
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
