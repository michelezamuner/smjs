const _package = 'Router.';

const RouterException = require('./RouterException');
const Request = require('./Request');
const Container = require('container').Container;

module.exports = class Router {
    static get __DEPS__() { return [ Container, 'router.config' ]; }
    static toString() { return _package + Router.name; }

    /**
     * @param {Container} container
     * @param {{routes: Object[]}} config
     */
    constructor(container, config) {
        this._container = container;
        this._routes = config.routes;
    }

    /**
     * @param {Request} request
     * @throws {RouterException}
     */
    route(request) {
        const route = this._getRoute(request.getEndpoint());
        const controller = this._container.make(route.controller);
        const [action, params] = this._parseAction(route.action, request);

        if (controller[action] === undefined) {
            throw new RouterException(`Action "${action}" not supported by controller`);
        }

        controller[action](...params);
    }

    /**
     * @param {string} endpoint
     * @return {{endpoint, controller, action}}
     * @private
     */
    _getRoute(endpoint) {
        for (const routeEndpoint in this._routes) {
            if (routeEndpoint === endpoint) {
                return this._routes[endpoint];
            }
        }

        throw new RouterException(`Resource endpoint "${endpoint}" is not configured`);
    }

    /**
     * @param {string} definition
     * @param {Request} request
     * @return {[string, Object[]]}
     * @private
     */
    _parseAction(definition, request) {
        const separator = definition.indexOf('(');
        if (separator === -1) {
            throw new RouterException(`Malformed action definition "${definition}"`);
        }

        const action = definition.split('(')[0];
        const formalParams = definition
            .substring(separator + 1, definition.length - 1)
            .split(',')
            .filter(param => param !== '')
            .map(param => param.trim());

        const params = formalParams.map(param => {
            const actual = request.getParameter(param);
            if (actual === undefined) {
                throw new RouterException(`Missing required "${param}" parameter of definition "${definition}"`);
            }

            return actual;
        });

        return [action, params];
    }
};
