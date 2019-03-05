const Integer = require('../data/Integer');
const Data = require('../data/Data');
const Size = require('../data/Size');

/**
 * @interface
 */
module.exports = class SlothMachineFramework_Architecture_System {
    constructor() {
        if (new.target === SlothMachineFramework_Architecture_System) {
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
