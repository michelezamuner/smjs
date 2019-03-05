/**
 * @interface
 */
module.exports = class Console_Console {
    constructor() {
        if (new.target === Console_Console) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} message
     */
    write(message) {
        throw 'Not implemented';
    }

    writeError(message) {
        throw 'Not implemented';
    }

    /**
     * @param {number} [exitStatus=0]
     */
    exit(exitStatus = 0) {
        throw 'Not implemented';
    }
};
