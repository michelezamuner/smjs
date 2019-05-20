const _package = 'FindBooks.ServiceApplication.Widgets.';

/**
 * @interface
 */
module.exports = class WidgetAdapterFactory {
    static toString() { return _package + WidgetAdapterFactory.name; }

    constructor() {
        if (new.target === WidgetAdapterFactory) {
            throw 'Cannot implement interface';
        }
    }

    /**
     * @param {Function} widgetClass
     * @return {Object}
     */
    createAdapter(widgetClass) {
        throw 'Not implemented';
    }
};
