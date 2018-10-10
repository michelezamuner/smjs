const fs = require('fs');

module.exports = class System {
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
