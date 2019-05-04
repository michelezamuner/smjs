const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const UI = require('../application/UI');

/**
 * @abstract
 */
module.exports = class Widget {
    static toString() { return _package + Widget.name; }

    /**
     * @param {MessageBus} bus
     * @param {UI} ui
     */
    constructor(bus, ui) {
        this._bus = bus;
        this._ui = ui;
    }

    connect() {
        throw 'Not implemented';
    }
};
