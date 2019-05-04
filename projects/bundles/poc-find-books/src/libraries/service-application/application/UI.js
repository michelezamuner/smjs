const _package = 'FindBooks.ServiceApplication.Application.';

const Widget = require('./Widget');

module.exports = class UI {
    static toString() { return _package + UI.name; }

    constructor() {
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

    /**
     * @return {Widget[]}
     */
    getWidgets() {
        return Array.from(this._widgets.values());
    }
};
