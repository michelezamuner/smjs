const _package = 'ConsoleWrapper.';

/**
 * @interface
 */
module.exports = class Console {
    static toString() { return _package + Console.name; }

    constructor() {
        if (new.target === Console) {
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
