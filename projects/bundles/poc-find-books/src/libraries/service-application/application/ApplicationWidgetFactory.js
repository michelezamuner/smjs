const _package = 'FindBooks.ServiceApplication.Application.';

const InputParser = require('../input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./ApplicationWidgetDeps');
const Connection = require('../server/Connection');
const WidgetDeps = require('../widgets/WidgetDeps');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ InputParser ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {InputParser} parser
     */
    constructor(parser) {
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
        const deps = new ApplicationWidgetDeps(bus, connection, this._parser);
        const app = new applicationWidgetClass(deps);

        for (const widget of widgets) {
            const deps = new WidgetDeps(bus, app, widget.params);
            app.addWidget(widget.name, new widget.type(deps));
        }

        return app;
    }
};
