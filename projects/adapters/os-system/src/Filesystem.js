/**
 * @interface
 */
module.exports = class OSSystem_Filesystem {
    constructor() {
        if (new.target === OSSystem_Filesystem) {
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
