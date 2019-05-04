const _package = 'FindBooks.ServiceApplication.Application.';

const WidgetBuilder = require('./WidgetBuilder');
const InputParser = require('../input-parser/InputParser');
const Application = require('./Application');
const MessageBus = require('message-bus').MessageBus;
const UI = require('./UI');
const ApplicationParams = require('./ApplicationParams');
const Connection = require('../server/Connection');

module.exports = class ApplicationFactory {
    static get __DEPS__() { return [ WidgetBuilder, InputParser ]; }
    static toString() { return _package + ApplicationFactory.name; }

    /**
     * @param {WidgetBuilder} builder
     * @param {InputParser} parser
     */
    constructor(builder, parser) {
        this._builder = builder;
        this._parser = parser;
    }

    /**
     * @param {{name: {string}, type: {Function}, args: {array}}[]} widgets
     * @param {Connection} connection
     * @return {Application}
     */
    create(widgets, connection) {
        const bus = new MessageBus();
        const ui = new UI();
        this._builder.setMessageBus(bus);
        this._builder.setUI(ui);

        for (const widget of widgets) {
            this._builder.build(widget.name, widget.type, widget.args);
        }

        const params = new ApplicationParams(connection, this._parser);

        return new Application(bus, ui, params);
    }
};
