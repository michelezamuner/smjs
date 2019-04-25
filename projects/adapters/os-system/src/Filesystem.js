const _package = 'SlothMachine.OSSystem.';

/**
 * @interface
 */
module.exports = class Filesystem {
    static toString() { return _package + Filesystem.name; }

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
