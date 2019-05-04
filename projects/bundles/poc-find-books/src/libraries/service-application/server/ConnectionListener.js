const _package = 'FindBooks.ServiceApplication.Server.';

const Connection = require('./Connection');

/**
 * @interface
 */
module.exports = class ConnectionListener {
    static toString() { return _package + ConnectionListener.name; }

    constructor() {
        if (new.target === ConnectionListener) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Connection} connection
     */
    listen(connection) {
        throw 'Not implemented';
    };
};
