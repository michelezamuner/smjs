const _package = 'SlothMachine.SlothMachine.';

const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('./RequestReceived');
const ErrorHandlerFailed = require('./ErrorHandlerFailed');
const Parser = require('command-line-parser');

module.exports = class Launcher {
    static get DEFAULT_REPRESENTATION() { return 'integrated'; }
    static get ARG_ARCHITECTURE() { return 'arc'; }
    static toString() { return _package + Launcher.name; }

    /**
     * @param {Container} container
     * @param {Object} config
     */
    constructor(container, config) {
        this._container = container;
        this._config = config;
    }

    /**
     * @param {Parser} parser
     * @throws {RouterException}
     */
    launch(parser) {
        try {
            this._container.bind('config', this._config);
            for (const providerClass of this._config.providers) {
                this._container.make(providerClass).register();
            }

            // @todo: allow different representations
            const message = new RequestReceived(
                'sloth_machine/run_program',
                Launcher.DEFAULT_REPRESENTATION,
                {
                    architecture: parser.getArgument(Launcher.ARG_ARCHITECTURE),
                    file: parser.getArgument()
                }
            );
            this._container.make(MessageBus).send(message);
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * @param {*} e
     * @private
     */
    _handleError(e) {
        const message = new RequestReceived('sloth_machine_core/handle_error', 'error', {
            error: e instanceof Error ? e : new Error(e)
        });
        try {
            this._container.make(MessageBus).send(message);
        } catch (e) {
            // prevent infinite recursion
            this._container.make(MessageBus).send(new ErrorHandlerFailed(e instanceof Error ? e : new Error(e)));
        }
    }
};
