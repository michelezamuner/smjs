const Presenter = require('./Presenter');
const Notifier = require('app/notifications').Notifier;
const Request = require('./Request');
const Response = require('./Response');
const ErrorReceived = require('./messages/ErrorReceived');

module.exports = class Core_HandleError_HandleError {
    static get __DEPS__() { return [ Presenter, Notifier ]; }

    /**
     * @param {Presenter} presenter
     * @param {Notifier} notifier
     */
    constructor(presenter, notifier) {
        this._presenter = presenter;
        this._notifier = notifier;
    }

    /**
     * @param {Request} request
     */
    handle(request) {
        this._notifier.notify(new ErrorReceived(request.getError()));
        this._presenter.present(new Response(new Error('A fatal error happened in the application')));
    }
};
