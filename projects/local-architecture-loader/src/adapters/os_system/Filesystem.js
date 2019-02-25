/**
 * @interface
 */
module.exports = class Filesystem {
    constructor() {
        if (new.target === Filesystem) {
            throw 'Cannot instantiate interface';
        }
    }

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
