const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const WidgetDeps = require('./WidgetDeps');

/**
 * @abstract
 */
module.exports = class Widget {
    static toString() { return _package + Widget.name; }

    /**
     * @param {WidgetDeps} deps
     */
    constructor(deps) {
        this._bus = deps.getBus();
        this._app = deps.getApp();
        this._widgets = [];
    }

    /**
     * @param {Widget} widget
     */
    addWidget(widget) {
        this._widgets.push(widget);
    }

    connect() {
        this._widgets.forEach(widget => widget.connect());
    }
};
