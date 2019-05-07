const _package = 'FindBooks.ServiceApplication.Widgets.';

module.exports = class WidgetAdapters {
    static toString() { return _package + WidgetAdapters.name; }

    constructor() {
        this._adapters = new Map();
    }

    /**
     * @param {Function} widgetClass
     */
    getAdapter(widgetClass) {
        if (!this._adapters.has(widgetClass)) {
            this._adapters.set(widgetClass, this._createAdapter(widgetClass));
        }

        return this._adapters.get(widgetClass);
    }

    /**
     * @param {Function} widgetClass
     * @return {Object}
     * @protected
     */
    _createAdapter(widgetClass) {
        throw 'Not implemented';
    }
};
