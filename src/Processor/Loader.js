const Memory = require('../ProcessorProtocol/Memory');

module.exports = class Loader {
    /**
     * @param {Memory} memory
     */
    constructor(memory) {
        this._memory = memory;
        this._addressType = this._memory.getMax().constructor;
    }

    /**
     * @param {Byte[]} bytes
     */
    load(bytes) {
        const size = bytes.length;
        for (let address = 0; address < size; address++) {
            this._memory.write(new this._addressType(address), bytes[address]);
        }
    }
};
