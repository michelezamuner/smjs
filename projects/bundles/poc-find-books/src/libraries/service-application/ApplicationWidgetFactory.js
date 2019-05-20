const _package = 'FindBooks.ServiceApplication.';

const InputParser = require('./input-parser/InputParser');
const WidgetAdapters = require('./widgets/WidgetAdapters');
const Config = require('./Config');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./widgets/ApplicationWidgetDeps');
const Connection = require('./server/Connection');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ InputParser, WidgetAdapters, Config ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {InputParser} parser
     * @param {WidgetAdapters} adapters
     * @param {Config} config
     */
    constructor(parser, adapters, config) {
        this._parser = parser;
        this._adapters = adapters;
        this._applicationWidgetClass = config.getApplicationWidgetClass();
    }

    /**
     * @param {Connection} connection
     * @return {Application}
     */
    create(connection) {
        const deps = new ApplicationWidgetDeps(new MessageBus(), connection, this._parser, this._adapters);

        return new this._applicationWidgetClass(deps);
    }
};
