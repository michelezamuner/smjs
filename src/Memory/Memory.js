const MemoryInterface = require('../ProcessorArchitecture/Memory');
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
        if (address.toInt() > this._max.toInt()) {
            throw `Address ${address.toInt()} exceeds memory max (${this._max.toInt()})`;
        }

        if (!(address.toInt() in this._memory)) {
            return new Byte(0x00);
        }

        return new Byte(this._memory[address.toInt()]);
    }

    /**
     * @inheritDoc
     */
    readSet(address, size) {
        const bytes = [];
        for (let i = 0; i < size.toInt(); i++) {
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

        if (address.toInt() > this._max.toInt()) {
            throw `Address ${address.toInt()} exceeds memory max (${this._max.toInt()})`;
        }

        this._memory[address.toInt()] = value.toInt();
    }
};
