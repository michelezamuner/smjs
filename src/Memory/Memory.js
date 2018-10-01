const MemoryInterface = require('../ProcessorArchitecture/Memory');
const Byte = require('../DataTypes/Byte');

/**
 * @implements MemoryInterface
 */
module.exports = class Memory extends MemoryInterface {
    /**
     * @param {number} size
     */
    constructor(size) {
        super();
        this._size = size;
        this._memory = [];
        this._maximumAddress = 2**size - 1;
    }

    /**
     * @inheritDoc
     */
    getSize() {
        return this._size;
    }

    /**
     * @inheritDoc
     */
    read(address) {
        return this._read(address.toInt());
    }

    /**
     * @inheritDoc
     */
    readSet(address, size) {
        const bytes = [];
        for (let i = 0; i < size; i++) {
            bytes.push(this._read(address.toInt() + i));
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

        const addr = address.toInt();
        if (addr > this._maximumAddress) {
            throw `Address ${addr} exceeds memory size (${this._size} Bytes)`;
        }

        this._memory[addr] = value.toInt();
    }

    /**
     * @param {number} address
     * @returns {Byte}
     * @private
     */
    _read(address) {
        if (address > this._maximumAddress) {
            throw `Address ${address} exceeds memory size (${this._size} Bytes)`;
        }

        if (!(address in this._memory)) {
            return new Byte(0x00);
        }

        return new Byte(this._memory[address]);
    }
};
