const _package = 'Logger.';

/**
 * @interface
 */
module.exports = class Handler {
    static toString() { return _package + Handler.name; }

    constructor() {
        if (new.target === Handler) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} message
     */
    handle(message) {
        throw 'Not implemented';
    }
};
