const Provider = require('./Provider');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const Router = require('router').Router;
const Input = require('router').Input;
const RequestReceived = require('../../src/RequestReceived');

module.exports = class SlothMachine_Providers_RouterProvider extends Provider {
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
    register() {
        const bus = this._container.make(MessageBus);
        const router = this._container.make(Router);

        bus.register([RequestReceived], msg =>
            router.route(new Input(msg.getEndpoint(), msg.getRepresentation(), msg.getParameters()))
        );
    }
};
