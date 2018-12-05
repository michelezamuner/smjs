const MemoryInterface = require('../ProcessorInterfaces/Memory');
const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * @implements MemoryInterface
 */
module.exports = class Memory extends MemoryInterface {
    /**
     * @param {DataType} max
     */
    constructor(max) {
        super();
        this._max = max;
        this._memory = [];
    }

    /**
     * @inheritDoc
     */
    getMax() {
        return this._max;
    }

    /**
     * @inheritDoc
     */
    read(address, size) {
        if (size.eq(new Byte())) {
            throw 'Size of memory to read cannot be zero';
        }

        const bytes = [];
        for (let i = 0; i < parseInt(size); i++) {
            const addr = parseInt(address) + i;
            if (addr > parseInt(this._max)) {
                throw `Address 0x${addr.toString(16)} exceeds memory max (${this._max})`;
            }
            const value = addr in this._memory ? new Byte(this._memory[addr]) : new Byte();
            bytes.push(value);
        }

        return bytes;
    }

    /**
     * @inheritDoc
     */
    write(address, value) {
        const bytes = value.expand === undefined ? value : value.expand();
        for (let i = 0; i < bytes.length; i++) {
            const addr = parseInt(address) + i;
            if (addr > parseInt(this._max)) {
                throw `Address 0x${addr.toString(16)} exceeds memory max (${this._max})`;
            }
            this._memory[addr] = bytes[i];
        }
    }
};
