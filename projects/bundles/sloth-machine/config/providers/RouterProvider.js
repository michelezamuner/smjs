const Provider = require('./Provider');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const Router = require('router').Router;
const Request = require('router').Request;
const ViewRegistered = require('../../src/ViewRegistered');

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

        bus.register([ViewRegistered], msg => router.route(new Request(msg.getEndpoint(), msg.getParameters())));
    }
};
