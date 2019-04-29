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
     * @return {Application}
     */
    create() {
        return new Application(new MessageBus(), this._widgetFactory, this._parser);
    }
};
