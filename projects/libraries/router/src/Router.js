const RouterException = require('./RouterException');
const Input = require('./Input');
const Container = require('container').Container;

module.exports = class Router_Router {
    static get __DEPS__() { return [ Container, 'router.config' ]; }

    /**
     * @param {Container} container
     * @param {{routes: Object[]}} config
     */
    constructor(container, config) {
        this._container = container;
        this._routes = config.routes;
    }

    /**
     * @param {Input} input
     * @throws {RouterException}
     */
    route(input) {
        const route = this._getRoute(input.getIdentifier());
        const controller = this._container.make(route.controller);
        const [action, params] = this._parseAction(route.action, input);

        if (controller[action] === undefined) {
            throw new RouterException(`Action "${action}" not supported by controller`);
        }

        controller[action](...params);
    }

    /**
     * @param {string} identifier
     * @return {{identifier, controller, action}}
     * @private
     */
    _getRoute(identifier) {
        for (const route of this._routes) {
            if (route.identifier === identifier) {
                return route;
            }
        }

        throw new RouterException(`Resource identifier "${identifier}" is not configured`);
    }

    /**
     * @param {string} definition
     * @param {Input} input
     * @return {[string, Object[]]}
     * @private
     */
    _parseAction(definition, input) {
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
            const actual = input.getParameter(param);
            if (actual === undefined) {
                throw new RouterException(`Missing required "${param}" parameter of definition "${definition}"`);
            }

            return actual;
        });

        return [action, params];
    }
};
