const net = require('net');

module.exports = class Client {
    constructor() {
        this._client = new net.Socket();
        this._client.on('data', data => console.log(data.toString()));
        this._input = process.env.SM_INPUT;
    }

    connect() {
        this._client.connect(2222, '127.0.0.1', () => this._client.write(this._input));
    }
}