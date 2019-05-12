const Container = require('container').Container;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const StreamEndpointWidget = require('../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const WidgetAdapters = require('../../../../../src/libraries/service-application/widgets/WidgetAdapters');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response11 = args[1];
const response12 = args[2];
const response21 = args[3];
const response22 = args[4];

class UseCase {
    /**
     * @param {string} id
     * @return {string[]}
     */
    getMessages(id) {
        switch (id) {
            case '1234':
                return [response11, response12];
            case '4321':
                return [response21, response22];
            default:
                return []
        }
    }
}

class StubWidgetAdapters extends WidgetAdapters {
    static get __DEPS__() { return [Container]; }

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
    _createAdapter(widgetClass) {
        return this._container.make(widgetClass);
    }
}

class StubWidget extends StreamEndpointWidget {
    /** @override **/
    getAdapterClass() { return UseCase; }

    /**
     * @param {Object} params
     */
    receive(params) {
        const messages = this.getAdapter().getMessages(params.id);
        for (const message of messages) {
            this.write(message);
        }

        this.close();
    }
}

class StubApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('stream-widget', StubWidget, { endpoint: endpoint });
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
        this._app.run('127.0.0.1', 2223);
    }
}

container.make(Application).run();
