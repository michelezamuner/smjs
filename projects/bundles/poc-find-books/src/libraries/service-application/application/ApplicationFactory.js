const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBusFactory = require('./MessageBusFactory');
const WidgetFactory = require('./WidgetFactory');
const InputParser = require('../input-parser/InputParser');
const Application = require('./Application');

module.exports = class ApplicationFactory {
    static get __DEPS__() { return [MessageBusFactory, WidgetFactory, InputParser]; }
    static toString() { return _package + ApplicationFactory.name; }

    /**
     * @param {MessageBusFactory} busFactory
     * @param {WidgetFactory} widgetFactory
     * @param {InputParser} parser
     */
    constructor(busFactory, widgetFactory, parser) {
        this._busFactory = busFactory;
        this._widgetFactory = widgetFactory;
        this._parser = parser;
    }

    /**
     * @return {Application}
     */
    create() {
        return new Application(this._busFactory, this._widgetFactory, this._parser);
    }
};
