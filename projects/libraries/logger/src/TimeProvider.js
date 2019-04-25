const _package = 'Logger.';

/**
 * @interface
 */
module.exports = class TimeProvider {
    static toString() { return _package + TimeProvider.name; }

    constructor() {
        if (new.target === TimeProvider) {
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
