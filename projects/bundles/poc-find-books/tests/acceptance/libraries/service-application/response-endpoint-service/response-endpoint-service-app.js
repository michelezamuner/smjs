const Container = require('container').Container;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const WidgetAdapters = require('../../../../../src/libraries/service-application/widgets/WidgetAdapters');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response = args[1];

class UseCase {
    /**
     * @return {string}
     */
    getResponse() {
        return response;
    }
}

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

class StubWidget extends ResponseEndpointWidget {
    /** @override */
    getAdapterClass() { return UseCase; }

    /**
     * @param {Object} params
     */
    receive(params) {
        const response = this.getAdapter().getResponse();
        this.respond(response);
    }
}

class StubApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('endpoint-widget', StubWidget, { endpoint: endpoint });
    }
}

class Application {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        container.bind(InputParser, BasicInputParser);
        container.bind(WidgetAdapters, StubWidgetAdapters);

        this._app = container.make(ServiceApplication);
        this._app.setApplicationWidgetClass(StubApplicationWidget);
    }

    run() {
        this._app.run('127.0.0.1', 2222);
    }
}

container.make(Application).run();
