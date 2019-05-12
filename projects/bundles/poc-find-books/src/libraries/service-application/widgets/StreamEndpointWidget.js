const _pacakge = 'FindBooks.ServiceApplication.Widgets.';

const EndpointWidget = require('./EndpointWidget');
const SendData = require('../messages/SendData');
const SendResponse = require('../messages/SendResponse');

module.exports = class StreamEndpointWidget extends EndpointWidget {
    static toString() { return _pacakge + StreamEndpointWidget.name; }

    /**
     * @param {string} data
     */
    write(data) {
        this._bus.send(new SendData(data));
    }

    close() {
        this._bus.send(new SendResponse(''));
    }
};
