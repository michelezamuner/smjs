module.exports = class Filesystem {
    /**
     * @param {number} fd
     * @param {Buffer} buf
     * @param {number} count
     * @return {number}
     */
    write(fd, buf, count) {
        throw 'Not implemented';
    }
};
