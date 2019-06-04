const Container = require('container').Container;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const WidgetAdapterFactory = require('../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const Config = require('../../../../../src/libraries/service-application/Config');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response = args[1];

class SearchBooksView {
    constructor() {
        if (new.target === SearchBooksView) {
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

class SearchBooksAdapter {
    constructor() {
        if (new.target === SearchBooksAdapter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    respond(response) {
        throw 'Not implemented';
    }
}

class SearchBooksJsonView extends SearchBooksView {
    static get __DEPS__() { return [ SearchBooksAdapter ]; }

    /**
     * @param {SearchBooksAdapter} adapter 
     */
    constructor(adapter) {
        super();
        this._adapter = adapter;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._adapter.respond(viewModel.response);
    }
}

class SearchBooksPresenter {
    constructor() {
        if (new.target === SearchBooksPresenter) {
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

class SearchBooksServicePresenter extends SearchBooksPresenter {
    static get __DEPS__() { return [ SearchBooksView ]; }

    /**
     * @param {SearchBooksView} view
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

class SearchBooks {
    static get __DEPS__() { return [ SearchBooksPresenter ]; }

    /**
     * @param {SearchBooksPresenter} presenter
     */
    constructor(presenter) {
        this._presenter = presenter;
    }

    /**
     * @param {string} searchText
     */
    search(searchText) {
        if (searchText === 'text') {
            this._presenter.present(response);
        }
    }
}

class SearchBooksController {
    static get __DEPS__() { return [ SearchBooks ]; }

    /**
     * @param {SearchBooks} service 
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {string} searchText 
     */
    search(searchText) {
        this._service.search(searchText);
    }
}

class SearchBooksWidgetAdapter extends SearchBooksAdapter {
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
}

class SearchBooksWidget extends ResponseEndpointWidget {
    /** @override */
    getAdapterClass() { return SearchBooksWidgetAdapter; }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        const searchText = request.getParams().searchText;
        const format = request.getMeta().format;
        this.getAdapter().receive(searchText, format);
    }
}

class ServiceApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('search-books', SearchBooksWidget, { endpoint: endpoint });
    }
}

class ContainerWidgetAdapterFactory extends WidgetAdapterFactory {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        super();
        this._container = container
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
        this._container.bind(SearchBooksPresenter, SearchBooksServicePresenter);
        this._container.bind(SearchBooksView, (container, context) => {
            if (context.format !== 'json') {
                throw 'Invalid format';
            }
            return container.make(SearchBooksJsonView, context.adapter);
        });
        this._container.bind(SearchBooksAdapter, (container, adapter) => {
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
        this._app.run('127.0.0.1', 2222);
    }
}

container.make(App).run();
