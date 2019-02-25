const RouterException = require('./RouterException');
const ModuleLoader = require('./ModuleLoader');
const Input = require('./Input');
const Container = require('container').Container;

module.exports = class Router {
    /**
     * @param {Container} container
     * @param {ModuleLoader} loader
     * @param {Object} config
     */
    constructor(container, loader, config) {
        this._container = container;
        this._loader = loader;
        this._config = config;
    }

    /**
     * @param {Input} input
     * @throws {RouterException}
     */
    route(input) {
        const config = this._config[input.getIdentifier()];
        if (config === undefined) {
            throw new RouterException(`Resource identifier "${input.getIdentifier()}" is not configured`);
        }

        const controllerClass = this._load(config.controller);
        const action = this._getAction(config.action);
        const params = this._getParams(config.action, input);
        const viewInterface = this._load(config.viewInterface);
        const viewClass = this._load(config.views[input.getRepresentation()]);

        this._container.bind(viewInterface, viewClass);
        const controller = this._make(controllerClass);

        if (controller[action] === undefined) {
            throw new RouterException(`Action "${action}" not supported by controller`);
        }

        controller[action](...params);
    }

    /**
     * @param {string} actionDefinition
     * @return {string}
     * @private
     */
    _getAction(actionDefinition) {
        return actionDefinition.split('(')[0];
    }

    /**
     * @param {string} actionDefinition
     * @param {Input} input
     * @return {string[]}
     * @throws {RouterException}
     * @private
     */
    _getParams(actionDefinition, input) {
        const separator = actionDefinition.indexOf('(');
        if (separator === -1) {
            return [];
        }

        const formalParams = actionDefinition
            .substring(separator + 1, actionDefinition.length - 1)
            .split(',')
            .map(param => param.trim());

        return formalParams.map(param => {
            const actual = input.getParameter(param);
            if (actual === undefined) {
                throw new RouterException(`Missing required "${param}" parameter of definition "${actionDefinition}"`);
            }

            return actual;
        });
    }

    /**
     * @param {string} module
     * @return {Object}
     * @throws {RouterException}
     * @private
     */
    _load(module) {
        try {
            return this._loader.load(module);
        } catch (e) {
            throw new RouterException(e);
        }
    }

    /**
     * @param {Object} reference
     * @return {Object}
     * @throws {RouterException}
     * @private
     */
    _make(reference) {
        try {
            return this._container.make(reference);
        } catch (e) {
            throw new RouterException(e);
        }
    }
};
