const Memory = require('../ProcessorInterfaces/Memory');
const Byte = require('../DataTypes/Byte');

module.exports = class Loader {
    /**
     * @param {Memory} memory
     */
    constructor(memory) {
        this._memory = memory;
        this._addressType = this._memory.getMax().constructor;
    }

    /**
     * @param {string} data
     */
    load(data) {
        const bytes = data.split('').map(char => new Byte(char.charCodeAt(0)));
        this._memory.write(new this._addressType(0), bytes);
    }
};
