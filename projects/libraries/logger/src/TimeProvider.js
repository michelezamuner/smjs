/**
 * @interface
 */
module.exports = class Logger_TimeProvider {
    constructor() {
        if (new.target === Logger_TimeProvider) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {Date}
     */
    now() {
        throw 'Not implemented';
    }
};
