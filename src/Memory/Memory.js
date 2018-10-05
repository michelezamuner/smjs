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
            throw `Address ${address.uint()} exceeds memory max (${this._max.uint()})`;
        }

        if (!(address.uint() in this._memory)) {
            return new Byte(0x00);
        }

        return new Byte(this._memory[address.uint()]);
    }

    /**
     * @inheritDoc
     */
    readSet(address, size) {
        const bytes = [];
        for (let i = 0; i < size.uint(); i++) {
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
            throw `Address ${address.uint()} exceeds memory max (${this._max.uint()})`;
        }

        this._memory[address.uint()] = value.uint();
    }
};
