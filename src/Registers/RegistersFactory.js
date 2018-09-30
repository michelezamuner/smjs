const Registers = require('./Registers');

module.exports = class RegisterFactory {
    /**
     * @param {Object} config
     * @returns {Registers}
     */
    create(config) {
        return new Registers(config);
    }
};
