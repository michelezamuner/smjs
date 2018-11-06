const fs = require('fs');

module.exports = class System {
    /**
     * @param {number} fd
     * @param {Buffer} buf
     * @param {number} count
     * @return {number}
     */
    read(fd, buf, count) {
        return fs.readSync(fd, buf, 0, count);
    }

    /**
     * @param {number} fd
     * @param {number[]} buf
     * @param {number} count
     * @return {number}
     */
    write(fd, buf, count) {
        return fs.writeSync(fd, Buffer.from(buf), 0, count);
    }
};
