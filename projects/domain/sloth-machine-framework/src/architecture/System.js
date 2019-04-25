const _package = 'SlothMachine.SlothMachineFramework.Architecture.';

const Integer = require('../data/Integer');
const Data = require('../data/Data');
const Size = require('../data/Size');

/**
 * @interface
 */
module.exports = class System {
    static toString() { return _package + System.name; }

    constructor() {
        if (new.target === System) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Integer} fd
     * @param {Data} data
     * @param {Size} size
     * @return {Size}
     */
    write(fd, data, size) {
        throw 'Not implemented';
    }
};
