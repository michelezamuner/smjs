const Architecture = require('./Architecture');
const UnsupportedArchitectureException = require('./UnsupportedArchitectureException');

module.exports = class Loader {
    /**
     * @param {string} name
     * @return {Architecture}
     * @throws UnsupportedArchitectureException
     */
    load(name) {
        throw 'Not implemented';
    }
};
