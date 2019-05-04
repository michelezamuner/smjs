const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser=  require('../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');

const container = new Container();
const args = process.argv.slice(2);
const endpoint = args[0];
const response = args[1];

class StubWidget extends EndpointWidget {
    /**
     * @param {Object} params
     */
    receive(params) {
        this.respond(response);
    }
}

class Application {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        const bus = new MessageBus();
        container.bind(MessageBus, bus);
        container.bind(InputParser, BasicInputParser);
        this._app = container.make(ServiceApplication);
        // TODO: change this
        this._app.addWidget(endpoint, StubWidget, endpoint);
    }

    run() {
        this._app.run('127.0.0.1', 2222);
    }
}

container.make(Application).run();
