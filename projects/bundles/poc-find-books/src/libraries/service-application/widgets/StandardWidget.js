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
        this._factory = deps.getWidgetAdapterFactory();
    }

    /**
     * @override
     */
    addWidget(name, type, params) {
        this._widgets.set(name, new type(new WidgetDeps(this._bus, this._factory, params)));
    }

    /**
     * @return {null|Function}
     */
    getAdapterClass() {
        return null;
    }

    /**
     * @return {Object}
     */
    getAdapter() {
        return this._factory.createAdapter(this.getAdapterClass());
    }
};
