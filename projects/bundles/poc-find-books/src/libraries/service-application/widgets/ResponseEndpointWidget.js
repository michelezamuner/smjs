const _package = 'FindBooks.ServiceApplication.Widgets.';

const EndpointWidget = require('./EndpointWidget');
const SendResponse = require('../messages/SendResponse');

/**
 * @abstract
 */
module.exports = class ResponseEndpointWidget extends EndpointWidget {
    static toString() { return _package + ResponseEndpointWidget.name; }

    /**
     * @param {string} response
     */
    respond(response) {
        this._bus.send(new SendResponse(response));
    }
};
