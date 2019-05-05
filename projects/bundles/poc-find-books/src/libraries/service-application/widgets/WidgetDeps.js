const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const Application = require('../application/Application');

module.exports = class WidgetDeps {
    static toString() { return _package + WidgetDeps.name; }

    /**
     * @param {MessageBus} bus
     * @param {Application} app
     * @param {Object} params
     */
    constructor(bus, app, params) {
        this._bus = bus;
        this._app = app;
        this._params = params;
    }

    /**
     * @return {MessageBus}
     */
    getBus() {
        return this._bus;
    }

    /**
     * @return {Application}
     */
    getApp() {
        return this._app;
    }

    /**
     * @return {Object}
     */
    getParams() {
        return this._params;
    }
};
