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
    read(address) {
        if (address.gt(this._max)) {
            throw `Address ${address} exceeds memory max (${this._max})`;
        }

        const index = parseInt(address);
        if (!(index in this._memory)) {
            return new Byte();
        }

        return new Byte(this._memory[index]);
    }

    /**
     * @inheritDoc
     */
    readSet(address, size) {
        const bytes = [];
        for (let i = new size.constructor(); i.lt(size); i = i.inc()) {
            bytes.push(this.read(address.add(new size.constructor(i))));
        }

        return bytes;
    }

    /**
     * @inheritDoc
     */
    write(address, value) {
        if (!(value instanceof Byte)) {
            throw 'Only single bytes can be written to memory';
        }

        if (address.gt(this._max)) {
            throw `Address ${address} exceeds memory max (${this._max})`;
        }

        this._memory[parseInt(address)] = parseInt(value);
    }
};
