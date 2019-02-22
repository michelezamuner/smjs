const Presenter = require('./Presenter');
const Request = require('./Request');
const Response = require('./Response');

module.exports = class HandleError {
    /**
     * @param {Presenter} presenter
     */
    constructor(presenter) {
        this._presenter = presenter;
    }

    /**
     * @param {Request} request
     */
    handle(request) {
        this._presenter.present(new Response(request.getError()));
    }
};
