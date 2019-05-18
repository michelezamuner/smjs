const Router = require('../src/Router');
const ControllerFactory = require('../src/ControllerFactory');
const Controller = require('../src/Controller');
const Request = require('../src/Request');
const RouterException = require('../src/RouterException');

/**
 * @type {Object|ControllerFactory}
 */
const factory = {};

/**
 * @type {Object}
 */
const config = {};

/**
 * @type {null|Router}
 */
let router = null;

/**
 * @type {Object|Controller}
 */
const controller = {};

/**
 * @type {Object|Request}
 */
const request = {};

/**
 * @type {string}
 */
const path = 'path';

/**
 * @type {string}
 */
const controllerClass = 'controllerClass';

beforeEach(() => {
    factory.create = (ctrl, req) => ctrl === controllerClass && req === request ? controller : null;
    config.routes = [{ path: path, controller: controllerClass }];
    request.getPath = () => path;
    controller.control = jest.fn();

    router = new Router(factory, config);
});

test('provides fqcn', () => {
    expect(Router.toString()).toBe('Router.Router');
    expect(ControllerFactory.toString()).toBe('Router.ControllerFactory');
    expect(Controller.toString()).toBe('Router.Controller');
    expect(RouterException.toString()).toBe('Router.RouterException');
});

test('calls configured controller on correct request', () => {
    router.route(request);

    expect(controller.control.mock.calls[0][0]).toBe(request);
});

test('fails if no route is found for request', () => {
    const path = 'non-existent-path';
    const request = { getPath: () => path };

    expect(() => router.route(request)).toThrow(RouterException);
    expect(() => router.route(request)).toThrow(`No route found for path '${path}'`);
});
