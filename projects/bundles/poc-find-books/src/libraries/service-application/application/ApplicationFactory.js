const _package = 'FindBooks.ServiceApplication.Application.';

const WidgetFactory = require('./WidgetFactory');
const InputParser = require('../input-parser/InputParser');
const Application = require('./Application');
const MessageBus = require('message-bus').MessageBus;

module.exports = class ApplicationFactory {
    static get __DEPS__() { return [ WidgetFactory, InputParser ]; }
    static toString() { return _package + ApplicationFactory.name; }

    /**
     * @param {WidgetFactory} widgetFactory
     * @param {InputParser} parser
     */
    constructor(widgetFactory, parser) {
        this._widgetFactory = widgetFactory;
        this._parser = parser;
    }

    /**
     * @param {{name: {string}, type: {Function}, args: {array}}[]} widgets
     * @return {Application}
     */
    create(widgets) {
        const bus = new MessageBus();

        return new Application(bus, this._parser, this._createWidgets(bus, widgets));
    }

    /**
     * @param {MessageBus} bus
     * @param {{name: {string}, type: {Function}, args: {array}}[]} widgets
     * @return {Object}
     * @private
     */
    _createWidgets(bus, widgets) {
        let widgetObjects = {};
        for (const widget of widgets) {
            widgetObjects[widget.name] = this._widgetFactory.create(widget.type, bus, widget.args);
        }

        return widgetObjects;
    }
};
