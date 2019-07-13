const _package = 'FindBooks.ServiceApplication.Widgets.';

module.exports = class Widget {
    static toString() { return _package + Widget.name; }

    constructor() {
        this._widgets = new Map();
    }

    connect() {
        this._widgets.forEach(widget => widget.connect());
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
};