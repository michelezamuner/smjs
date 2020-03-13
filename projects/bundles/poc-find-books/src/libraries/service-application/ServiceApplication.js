const _package = 'FindBooks.ServiceApplication.';

const ConnectionListener = require('./server/ConnectionListener');
const ServerFactory = require('./server/ServerFactory');
const ApplicationFactory = require('./ApplicationFactory');
const MessageBus = require('message-bus').MessageBus;

module.exports = class ServiceApplication extends ConnectionListener {
    static get __DEPS__() { return [ ServerFactory, ApplicationFactory ]; }
    static toString() { return _package + ServiceApplication.name; }

    /**
     * @param {ServerFactory} serverFactory
     * @param {ApplicationFactory} applicationFactory
     */
    constructor(serverFactory, applicationFactory) {
        super();
        this._serverFactory = serverFactory;
        this._applicationFactory = applicationFactory;
    }

    /**
     * @param {string} host
     * @param {number} port
     */
    run(host, port) {
        const server = this._serverFactory.create(this);
        server.listen(host, port);
    }

    /**
     * @override
     */
    listen(connection) {
        const app = this._applicationFactory.create(new MessageBus(), connection);
        app.connect();
    }
};
