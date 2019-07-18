const Container = require('container').Container;
const Provider = require('./Provider');
const ServiceApplication = require('../../../../../../../../src/libraries/service-application/ServiceApplication');

module.exports = class App {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        container.make(Provider).register();
        this._app = container.make(ServiceApplication);
    }

    run() {
        this._app.run('127.0.0.1', 2223);
    }
};