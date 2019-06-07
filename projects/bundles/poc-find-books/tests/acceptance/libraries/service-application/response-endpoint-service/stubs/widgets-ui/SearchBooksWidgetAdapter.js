const SearchBooksAdapter = require('../client-adapter/SearchBooksAdapter');
const Container = require('container').Container;
const SearchBooksWidget = require('./SearchBooksWidget');
const SearchBooksController = require('../client-adapter/SearchBooksController');

module.exports = class SearchBooksWidgetAdapter extends SearchBooksAdapter {
    /**
     * @param {Container} container
     * @param {SearchBooksWidget} widget
     */
    constructor(container, widget) {
        super();
        this._container = container;
        this._widget = widget;
    }

    /**
     * @param {string} search
     * @param {string} format
     */
    receive(search, format) {
        const controller = this._container.make(SearchBooksController, { format: format, adapter: this });
        controller.search(search);
    }

    /**
     * @override
     */
    respond(response) {
        this._widget.respond(response);
    }
};