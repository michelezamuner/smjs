const net = require('net');
const client = new net.Socket();
const args = process.argv.slice(2);
const input = args[0];

client.connect(2223, '127.0.0.1', () => {
    client.write(input);
});

client.on('data', function(data) {
    console.log(data.toString());
});
