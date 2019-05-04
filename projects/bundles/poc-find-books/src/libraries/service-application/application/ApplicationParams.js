const _package = 'FindBooks.ServiceApplication.Application.';

const Connection = require('../server/Connection');
const InputParser = require('../input-parser/InputParser');

module.exports = class ApplicationParams {
    static toString() { return _package + ApplicationParams.name; }

    /**
     * @param {Connection} connection
     * @param {InputParser} parser
     */
    constructor(connection, parser) {
        this._connection = connection;
        this._parser = parser;
    }

    /**
     * @return {Connection}
     */
    getConnection() {
        return this._connection;
    }

    /**
     * @return {InputParser}
     */
    getParser() {
        return this._parser;
    }
};
