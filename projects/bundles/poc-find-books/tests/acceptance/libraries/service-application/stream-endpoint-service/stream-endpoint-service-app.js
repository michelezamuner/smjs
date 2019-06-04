const Container = require('container').Container;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const StreamEndpointWidget = require('../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const WidgetAdapterFactory = require('../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const Config = require('../../../../../src/libraries/service-application/Config');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response11 = args[1];
const response12 = args[2];
const response21 = args[3];
const response22 = args[4];

class SearchResultsView {
    constructor() {
        if (new.target === SearchResultsView) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} viewModel 
     */
    render(viewModel) {
        throw 'Not implemented';
    }
}

class SearchCompleteView {
    constructor() {
        if (new.target === SearchCompleteView) {
            throw 'Cannot instantiate interface';
        }
    }

    render() {
        throw 'Not implemented';
    }
}

class SearchResultsAdapter {
    constructor() {
        if (new.target === SearchResultsAdapter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    write(response) {
        throw 'Not implemented';
    }

    close() {
        throw 'Not implemented';
    }
}


class SearchResultsTextView extends SearchResultsView {
    static get __DEPS__() { return [ SearchResultsAdapter ]; }

    /**
     * @param {SearchResultsAdapter} adapter 
     */
    constructor(adapter) {
        super();
        this._adapter = adapter;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._adapter.write(viewModel.response);
    }
}

class SearchCompleteEmptyView extends SearchCompleteView {
    static get __DEPS__() { return [ SearchResultsAdapter ]; }

    /**
     * @param {SearchResultsAdapter} adapter 
     */
    constructor(adapter) {
        super();
        this._adapter = adapter;
    }

    /**
     * @override
     */
    render() {
        this._adapter.close();
    }
}

class SearchResultsPresenter {
    constructor() {
        if (new.target === SearchResultsPresenter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} response 
     */
    present(response) {
        throw 'Not implemented';
    }
}

class SearchCompletePresenter {
    constructor() {
        if (new.target === SearchCompletePresenter) {
            throw 'Cannot instantiate interface';
        }
    }

    present() {
        throw 'Not implemented';
    }
}

class SearchResultsServicePresenter extends SearchResultsPresenter {
    static get __DEPS__() { return [ SearchResultsView ]; }

    /**
     * @param {SearchResultsView} view 
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @override
     */
    present(response) {
        const viewModel = { response: response };
        this._view.render(viewModel);
    }
}

class SearchCompleteServicePresenter extends SearchCompletePresenter {
    static get __DEPS__() { return [ SearchCompleteView ]; }

    /**
     * @param {SearchCompleteView} view 
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @override
     */
    present() {
        this._view.render();
    }
}

class RetrieveSearchResults {
    static get __DEPS__() { return [ SearchResultsPresenter, SearchCompletePresenter ]; }
    /**
     * @param {SearchResultsPresenter} resultsPresenter
     * @param {SearchCompletePresenter} completePresenter
     */
    constructor(resultsPresenter, completePresenter) {
        this._resultsPresenter = resultsPresenter;
        this._completePresenter = completePresenter;
    }

    /**
     * @param {string} searchId 
     */
    retrieve(searchId) {
        switch (searchId) {
            case 1234:
                this._resultsPresenter.present(response11);
                this._resultsPresenter.present(response12);
                break;
            case 4321:
                this._resultsPresenter.present(response21);
                this._resultsPresenter.present(response22);
                break;
        }
        this._completePresenter.present();
    }
}

class SearchResultsController {
    static get __DEPS__() { return [ RetrieveSearchResults ]; }

    /**
     * @param {RetrieveSearchResults} service 
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {string} searchId 
     */
    retrieveSearchResults(searchId) {
        this._service.retrieve(searchId);
    }
}

class SearchResultsWidgetAdapter extends SearchResultsAdapter {
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
}

class SearchResultsWidget extends StreamEndpointWidget {
    /** @override **/
    getAdapterClass() { return SearchResultsWidgetAdapter; }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        const searchId = request.getParams().id;
        const format = request.getMeta().format;
        this.getAdapter().receive(searchId, format);
    }
}

class ServiceApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('search-results', SearchResultsWidget, { endpoint: endpoint });
    }
}

class ContainerWidgetAdapterFactory extends WidgetAdapterFactory {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        super();
        this._container = container;
    }

    /**
     * @override
     */
    createAdapter(adapterClass, widget) {
        return new adapterClass(this._container, widget);
    }
}

class Provider {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container 
     */
    constructor(container) {
        this._container = container;
    }

    register() {
        this._container.bind(InputParser, BasicInputParser);
        this._container.bind(WidgetAdapterFactory, ContainerWidgetAdapterFactory);
        this._container.bind(Config, { getApplicationWidgetClass() { return ServiceApplicationWidget; }});
        this._container.bind(SearchResultsPresenter, SearchResultsServicePresenter);
        this._container.bind(SearchCompletePresenter, SearchCompleteServicePresenter);
        this._container.bind(SearchResultsView, (container, context) => {
            if (context.format !== 'txt') {
                throw 'Invalid format';
            }
            return container.make(SearchResultsTextView, context.adapter);
        });
        this._container.bind(SearchCompleteView, (container, context) => {
            return container.make(SearchCompleteEmptyView, context.adapter);
        });
        this._container.bind(SearchResultsAdapter, (container, adapter) => {
            return adapter;
        });
    }
}

class App {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        container.make(Provider).register();
        this._app = container.make(ServiceApplication);
    }

    run() {
        this._app.run('127.0.0.1', 2223);
    }
}

container.make(App).run();
