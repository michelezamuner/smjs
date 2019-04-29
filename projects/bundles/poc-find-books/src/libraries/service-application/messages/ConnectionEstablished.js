const _package = 'FindBooks.ServiceApplication.Messages.';

module.exports = class ConnectionEstablished {
    static toString() { return _package + ConnectionEstablished.name; }

    /**
     * @param {string} connection
     */
    constructor(connection) {
        this._connection = connection;
    }

    /**
     * @return {string}
     */
    getConnection() {
        return this._connection;
    }
};
