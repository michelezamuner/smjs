const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * Set of registers for a processor.
 */
module.exports = class Registers {
    /**
     * @param {Object} types
     */
    constructor(types)
    {
        this._registers = [];
        this._types = [];
        for (const register in types) {
            this[register] = new Byte(this._registers.length);
            this._types[this._registers.length] = types[register];
            this._registers[this._registers.length] = new types[register](0x00);
        }
    }

    /**
     * @param {Byte} register
     * @returns {DataType}
     */
    get(register) {
        if (this._registers.length <= register.toInt()) {
            throw `No register exists at address ${register.toInt()}`;
        }
        return this._registers[register.toInt()];
    }

    /**
     * @param {Byte} register
     * @param {DataType} value
     */
    set(register, value) {
        if (this._registers.length <= register.toInt()) {
            throw `No register exists at address ${register.toInt()}`;
        }
        if (!(value instanceof this._types[register.toInt()])) {
            throw 'Invalid size of register value.';
        }
        this._registers[register.toInt()] = value;
    }
};
