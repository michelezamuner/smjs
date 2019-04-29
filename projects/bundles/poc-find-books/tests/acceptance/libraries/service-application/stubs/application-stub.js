const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const ServiceApplication = require('../../../../../src/libraries/service-application/ServiceApplication');
const InputParser=  require('../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');

const container = new Container();
const bus = new MessageBus();
const args = process.argv.slice(2);
const endpoint = args[0];
const response = args[1];

container.bind(MessageBus, bus);
container.bind(InputParser, BasicInputParser);

class StubWidget extends EndpointWidget {
    /**
     * @param {Object} params
     */
    receive(params) {
        this.respond(response);
    }
}

const app = container.make(ServiceApplication);

app.addWidget(endpoint, StubWidget, endpoint);
app.run('127.0.0.1', 2222);
