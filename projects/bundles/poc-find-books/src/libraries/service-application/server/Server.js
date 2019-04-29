const _package = 'FindBooks.ServiceApplication.Server.';

const NodeServer = require('net').Server;

module.exports = class Server {
    static toString() { return _package + Server.name; }

    /**
     * @param {NodeServer} server
     */
    constructor(server) {
        this._server = server;
    }

    /**
     * @param {string} host
     * @param {number} port
     */
    listen(host, port) {
        this._server.listen(port, host);
    }
};
