const _package = 'FindBooks.ServiceApplication.Widgets.';

const StandardWidget = require('./StandardWidget');

module.exports = class WidgetAdapter {
    static toString() { return _package + WidgetAdapter.name; }
    
    constructor() {
        if (new.target === WidgetAdapter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {StandardWidget}
     */
    getWidget() {
        throw 'Not implemented';
    }
};