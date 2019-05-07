const _package = 'FindBooks.ServiceApplication.';

const ConnectionListener = require('./server/ConnectionListener');
const ServerFactory = require('./server/ServerFactory');
const ApplicationWidgetFactory = require('./ApplicationWidgetFactory');
const ApplicationWidget = require('./widgets/ApplicationWidget');

/**
 * @abstract
 */
module.exports = class ServiceApplication extends ConnectionListener {
    static get __DEPS__() { return [ ServerFactory, ApplicationWidgetFactory ]; }
    static toString() { return _package + ServiceApplication.name; }

    /**
     * @param {ServerFactory} serverFactory
     * @param {ApplicationWidgetFactory} applicationWidgetFactory
     */
    constructor(serverFactory, applicationWidgetFactory) {
        super();
        this._serverFactory = serverFactory;
        this._applicationWidgetFactory = applicationWidgetFactory;
        this._applicationWidgetClass = ApplicationWidget;
    }

    /**
     * @param {Function} applicationWidgetClass
     */
    setApplicationWidgetClass(applicationWidgetClass) {
        this._applicationWidgetClass = applicationWidgetClass;
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
        const app = this._applicationWidgetFactory.create(this._applicationWidgetClass, connection);
        app.connect();
    }
};
