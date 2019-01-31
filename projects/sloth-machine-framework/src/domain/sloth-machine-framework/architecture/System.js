const Integer = require('../data/Integer');
const Data = require('../data/Data');
const Size = require('../data/Size');

module.exports = class System {
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
