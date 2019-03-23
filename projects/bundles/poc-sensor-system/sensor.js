const net = require('net');
const config = require('./config/config');
const client = new net.Socket();
const args = process.argv.slice(2);

client.connect(config.signal_listener.port, config.signal_listener.host, () => {
    client.write(args[0]);
    client.destroy();
});
