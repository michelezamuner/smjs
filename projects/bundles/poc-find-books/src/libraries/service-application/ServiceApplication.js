const _package = 'FindBooks.ServiceApplication.';

const MessageBus = require('message-bus').MessageBus;
const ServerFactory = require('./server/ServerFactory');
const ApplicationFactory = require('./application/ApplicationFactory');
const ConnectionEstablished = require('./messages/ConnectionEstablished');

module.exports = class ServiceApplication {
    static get __DEPS__() { return [ MessageBus, ServerFactory, ApplicationFactory ]; }
    static toString() { return _package + ServiceApplication.name; }

    /**
     * @param {MessageBus} bus
     * @param {ServerFactory} serverFactory
     * @param {ApplicationFactory} applicationFactory
     */
    constructor(bus, serverFactory, applicationFactory) {
        this._serverFactory = serverFactory;
        this._applicationFactory = applicationFactory;
        this._widgets = [];

        bus.register([ConnectionEstablished], event => this._onConnection(event));
    }

    /**
     * @param {string} host
     * @param {number} port
     */
    run(host, port) {
        const server = this._serverFactory.create();
        server.listen(host, port);
    }

    /**
     * @param {string} name
     * @param {Function} type
     * @param {*} args
     * @return {EndpointWidget}
     * @protected
     */
    addWidget(name, type, ...args) {
        this._widgets.push({name: name, type: type, args: args});
    }

    /**
     * @param {ConnectionEstablished} event
     * @private
     */
    _onConnection(event) {
        const app = this._applicationFactory.create(this._widgets);
        app.connect(event.getConnection());
    }
};
