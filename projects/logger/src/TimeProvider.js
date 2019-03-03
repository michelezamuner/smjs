/**
 * @interface
 */
module.exports = class TimeProvider {
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
