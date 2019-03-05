const Presenter = require('./Presenter');
const MessageBus = require('app/message-bus').MessageBus;
const Request = require('./Request');
const Response = require('./Response');
const ErrorReceived = require('./messages/ErrorReceived');

module.exports = class Core_HandleError_HandleError {
    static get __DEPS__() { return [ Presenter, MessageBus ]; }

    /**
     * @param {Presenter} presenter
     * @param {MessageBus} bus
     */
    constructor(presenter, bus) {
        this._presenter = presenter;
        this._bus = bus;
    }

    /**
     * @param {Request} request
     */
    handle(request) {
        this._bus.send(new ErrorReceived(request.getError()));
        this._presenter.present(new Response(new Error('A fatal error happened in the application')));
    }
};
