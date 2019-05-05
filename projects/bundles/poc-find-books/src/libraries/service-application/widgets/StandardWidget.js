const _package = 'FindBooks.ServiceApplication.Widgets.';

const Widget = require('./Widget');
const WidgetDeps = require('./WidgetDeps');

/**
 * @abstract
 */
module.exports = class StandardWidget extends Widget {
    static toString() { return _package + StandardWidget.name; }

    /**
     * @param {WidgetDeps} deps
     */
    constructor(deps) {
        super(deps.getBus());
        this._app = deps.getApp();
    }

    /**
     * @override
     */
    addWidget(name, type, params) {
        this._widgets.set(name, new type(new WidgetDeps(this._bus, this._app, params)));
    }
};
