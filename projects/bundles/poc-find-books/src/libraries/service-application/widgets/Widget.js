const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;

/**
 * @abstract
 */
module.exports = class Widget {
    static toString() { return _package + Widget.name; }

    /**
     * @param {MessageBus} bus
     */
    constructor(bus) {
        this._bus = bus;
        this._widgets = new Map();
    }

    /**
     * @param {string} name
     * @param {Widget} widget
     */
    addWidget(name, widget) {
        this._widgets.set(name, widget);
    }

    /**
     * @param {string} name
     * @return {Widget}
     */
    getWidget(name) {
        return this._widgets.get(name);
    }

    connect() {
        this._widgets.forEach(widget => widget.connect());
    }
};
