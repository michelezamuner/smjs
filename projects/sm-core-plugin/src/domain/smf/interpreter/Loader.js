const Program = require('../program/Program');
const LoaderException = require('./LoaderException');

module.exports = class Loader {
    /**
     * @return {Program}
     * @throws {LoaderException}
     */
    load() {
        throw 'Not implemented';
    }
};
