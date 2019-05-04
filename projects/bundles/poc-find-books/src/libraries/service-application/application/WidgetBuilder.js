const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const UI = require('./UI');
const ServiceApplicationException = require('../ServiceApplicationException');

module.exports = class WidgetBuilder {
    static toString() { return _package + WidgetBuilder.name; }

    constructor() {
        this._bus = null;
        this._ui = null;
    }

    /**
     * @param {MessageBus} bus
     */
    setMessageBus(bus) {
        this._bus = bus;
    }

    /**
     * @param {UI} ui
     */
    setUI(ui) {
        this._ui = ui;
    }

    /**
     * @param {string} name
     * @param {Function} type
     * @param {Array} args
     * @return {Object}
     * @throws ServiceApplicationException
     */
    build(name, type, args = []) {
        if (this._bus === null) {
            throw new ServiceApplicationException('Cannot build widgets with no message bus set');
        }
        if (this._ui === null) {
            throw new ServiceApplicationException('Cannot build widgets with no UI set');
        }

        const widget = new type(this._bus, this._ui, ...args);
        this._ui.addWidget(name, widget);

        return widget;
    }
};
