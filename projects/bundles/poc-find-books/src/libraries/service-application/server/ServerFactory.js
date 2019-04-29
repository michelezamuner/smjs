const _package = 'FindBooks.ServiceApplication.Server.';

const ConnectionListener = require('./ConnectionListener');
const Connection = require('./Connection');
const Server = require('./Server');
const net = require('net');

module.exports = class ServerFactory {
    static get __DEPS__() { return [ ConnectionListener ]; }
    static toString() { return _package + ServerFactory.name; }

    /**
     * @param {ConnectionListener} listener
     */
    constructor(listener) {
        this._listener = listener;
    }


    /**
     * @return {Server}
     */
    create() {
        const server = net.createServer(connection => this._listener.listen(new Connection(connection)));

        return new Server(server);
    }
};
