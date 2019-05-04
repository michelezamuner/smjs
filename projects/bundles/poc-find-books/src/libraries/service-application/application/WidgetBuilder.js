const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const UI = require('./UI');
const Widget = require('../widgets/Widget');
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
     * @return {Widget}
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
        if (!(widget instanceof Widget)) {
            throw new ServiceApplicationException(`${type} does not extend Widget`);
        }

        this._ui.addWidget(name, widget);

        return widget;
    }
};
