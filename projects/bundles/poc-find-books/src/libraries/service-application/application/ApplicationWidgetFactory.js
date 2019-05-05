const _package = 'FindBooks.ServiceApplication.Application.';

const WidgetBuilder = require('./WidgetBuilder');
const InputParser = require('../input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./ApplicationWidgetDeps');
const Connection = require('../server/Connection');
const UI = require('./UI');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ WidgetBuilder, InputParser ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {WidgetBuilder} builder
     * @param {InputParser} parser
     */
    constructor(builder, parser) {
        this._builder = builder;
        this._parser = parser;
    }

    /**
     * @param {Function} applicationWidgetClass
     * @param {{name: {string}, type: {Function}, args: {array}}[]} widgets
     * @param {Connection} connection
     * @return {Application}
     */
    create(applicationWidgetClass, widgets, connection) {
        const bus = new MessageBus();
        const ui = new UI();
        this._builder.setMessageBus(bus);

        for (const conf of widgets) {
            const widget = this._builder.build(conf.type, conf.params);
            ui.addWidget(conf.name, widget);
        }

        const params = new ApplicationWidgetDeps(connection, this._parser);

        return new applicationWidgetClass(bus, ui, params);
    }
};
