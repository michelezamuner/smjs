const _package = 'FindBooks.ServiceApplication.Server.';

const ConnectionListener = require('./ConnectionListener');
const Connection = require('./Connection');
const Server = require('./Server');
const net = require('net');

module.exports = class ServerFactory {
    static toString() { return _package + ServerFactory.name; }

    /**
     * @param {ConnectionListener} listener
     * @return {Server}
     */
    create(listener) {
        const server = net.createServer(connection => listener.listen(new Connection(connection)));

        return new Server(server);
    }
};
