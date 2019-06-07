const SearchResultsAdapter = require('../client-adapter/SearchResultsAdapter');
const Container = require('container').Container;
const SearchResultsWidget = require('./SearchResultsWidget');
const SearchResultsController = require('../client-adapter/SearchResultsController');

module.exports = class SearchResultsWidgetAdapter extends SearchResultsAdapter {
    /**
     * @param {Container} container 
     * @param {SearchResultsWidget} widget 
     */
    constructor(container, widget) {
        super();
        this._container = container;
        this._widget = widget;
    }

    /**
     * @param {string} searchId 
     * @param {string} format
     */
    receive(searchId, format) {
        const controller = this._container.make(SearchResultsController, { format: format, adapter: this });
        controller.retrieveSearchResults(searchId);
    }

    /**
     * @override
     */
    write(response) {
        this._widget.write(response);
    }

    /**
     * @override
     */
    close() {
        this._widget.close();
    }
};