const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * Set of registers for a processor.
 */
module.exports = class Registers {
    /**
     * @param {Object} config
     */
    constructor(config)
    {
        this._registers = [];
        this._types = [];
        for (const register in config) {
            this[register] = new Byte(this._registers.length);
            this._types[this._registers.length] = config[register];
            this._registers[this._registers.length] = new config[register](0x00);
        }
    }

    /**
     * @param {Byte} register
     * @returns {DataType}
     */
    get(register) {
        if (this._registers.length <= register.get()) {
            throw `No register exists at address ${register.get()}`;
        }
        return this._registers[register.get()];
    }

    /**
     * @param {Byte} register
     * @param {DataType} value
     */
    set(register, value) {
        if (this._registers.length <= register.get()) {
            throw `No register exists at address ${register.get()}`;
        }
        if (!(value instanceof this._types[register.get()])) {
            throw 'Invalid size of register value.';
        }
        this._registers[register.get()] = value;
    }
};
