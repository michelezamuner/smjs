const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const WidgetAdapterFactory = require('./WidgetAdapterFactory');

module.exports = class WidgetDeps {
    static toString() { return _package + WidgetDeps.name; }

    /**
     * @param {MessageBus} bus
     * @param {WidgetAdapterFactory} factory
     * @param {Object} params
     */
    constructor(bus, factory, params = {}) {
        this._bus = bus;
        this._factory = factory;
        this._params = params;
    }

    /**
     * @return {MessageBus}
     */
    getBus() {
        return this._bus;
    }

    /**
     * @return {WidgetAdapterFactory}
     */
    getWidgetAdapterFactory() {
        return this._factory;
    }

    /**
     * @return {Object}
     */
    getParams() {
        return this._params;
    }
};
