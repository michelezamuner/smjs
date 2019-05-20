const Container = require('container').Container;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const WidgetAdapters = require('../../../../../src/libraries/service-application/widgets/WidgetAdapters');
const Config = require('../../../../../src/libraries/service-application/Config');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response = args[1];

class StubWidgetAdapters extends WidgetAdapters {
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
    _createAdapter(widgetClass) {
        return this._container.make(widgetClass);
    }
}

class SearchBooksAdapter {
    /**
     * @return {string}
     */
    getResponse() {
        return response;
    }
}

class SearchBooksWidget extends ResponseEndpointWidget {
    /** @override */
    getAdapterClass() { return SearchBooksAdapter; }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        const response = this.getAdapter().getResponse();
        this.respond(response);
    }
}

class ServiceWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('search-books', SearchBooksWidget, { endpoint: endpoint });
    }
}

class App {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        container.bind(InputParser, BasicInputParser);
        container.bind(WidgetAdapters, StubWidgetAdapters);
        container.bind(Config, { getApplicationWidgetClass() { return ServiceWidget; }});

        this._app = container.make(ServiceApplication);
    }

    run() {
        this._app.run('127.0.0.1', 2222);
    }
}

container.make(App).run();
