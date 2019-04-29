const _package = 'FindBooks.ServiceApplication.Server.';

const NodeSocket = require('net').Socket;

module.exports = class Connection {
    static toString() { return _package + Connection.name; }

    /**
     * @param {NodeSocket} connection
     */
    constructor(connection) {
        this._connection = connection;
    }

    /**
     * @param {string} event
     * @param {Function} listener
     */
    on(event, listener) {
        this._connection.on(event, listener);
    }

    /**
     * @param {string} data
     */
    write(data) {
        this._connection.write(data);
    }

    /**
     * @param {string} data
     */
    end(data) {
        this._connection.end(data);
    }
};
