const _package = 'SlothMachine.SlothMachineFramework.Program.';

const Address = require('../data/Address');
const Size = require('../data/Size');
const Data = require('../data/Data');
const InvalidAddressException = require('./InvalidAddressException');
const ReadOutOfBoundsException = require('./ReadOutOfBoundsException');

module.exports = class Program {
    static toString() { return _package + Program.name; }

    /**
     * @param {Data} data
     */
    constructor(data) {
        this._data = data.toArray();
    }

    /**
     * @param {Address} address
     * @param {Size} size
     * @return {Data}
     */
    read(address, size) {
        const length = parseInt(size.format());
        if (length === 0) {
            return new Data();
        }

        const start = parseInt(address.format());
        if (this._data[start] === undefined) {
            throw new InvalidAddressException(`Invalid address ${start}`);
        }

        const end = start + length;
        const read = this._data.slice(start, end);
        if (read.length !== length) {
            throw new ReadOutOfBoundsException(`Out of bounds read of ${length} units at address ${start}`);
        }

        return new Data(read);
    }
};
