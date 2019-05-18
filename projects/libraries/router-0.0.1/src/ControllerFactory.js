const _package = 'Router.';

const Request = require('./Request');
const Controller = require('./Controller');
const RouterException = require('./RouterException');

/**
 * @interface
 */
module.exports = class ControllerFactory {
    static toString() { return _package + ControllerFactory.name; }

    constructor() {
        if (new.target === ControllerFactory) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Function} controllerClass
     * @param {Request} request
     * @return {Controller}
     * @throws {RouterException}
     */
    create(controllerClass, request) {
        throw 'Not implemented';
    }
};
