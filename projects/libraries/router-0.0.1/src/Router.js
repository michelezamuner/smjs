const _package = 'Router.';

const ControllerFactory = require('./ControllerFactory');
const Request = require('./Request');
const RouterException = require('./RouterException');

module.exports = class Router {
    static toString() { return _package + Router.name }

    /**
     * @param {ControllerFactory} factory
     * @param {Object} config
     */
    constructor(factory, config) {
        this._factory = factory;
        this._config = config;
    }

    /**
     * @param {Request} request
     * @throws {RouterException}
     */
    route(request) {
        const controllerClass = this._getControllerClass(request.getPath());
        const controller = this._factory.create(controllerClass, request);

        controller.control(request);
    }

    /**
     * @param {string} path
     * @return {Controller}
     * @private
     */
    _getControllerClass(path) {
        for (const route of this._config.routes) {
            if (route.path === path) {
                return route.controller;
            }
        }

        throw new RouterException(`No route found for path '${path}'`);
    }
};
