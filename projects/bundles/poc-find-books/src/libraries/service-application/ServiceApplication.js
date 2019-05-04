const _package = 'FindBooks.ServiceApplication.';

const ConnectionListener = require('./server/ConnectionListener');
const ServerFactory = require('./server/ServerFactory');
const ApplicationFactory = require('./application/ApplicationFactory');

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
        this._widgets = [];
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
     * @override
     */
    listen(connection) {
        const app = this._applicationFactory.create(this._widgets, connection);
        app.connect();
    }
};
