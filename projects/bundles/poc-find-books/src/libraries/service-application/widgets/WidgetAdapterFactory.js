const _package = 'FindBooks.ServiceApplication.Widgets.';

const WidgetAdapter = require('./WidgetAdapter');
const StandardWidget = require('./StandardWidget');

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
     * @param {Function} adapterClass
     * @param {StandardWidget} widget
     * @return {WidgetAdapter}
     */
    createAdapter(adapterClass, widget) {
        throw 'Not implemented';
    }
};
