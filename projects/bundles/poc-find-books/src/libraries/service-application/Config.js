const _package = 'FindBooks.ServiceApplication.';

/**
 * @interface
 */
module.exports = class Config {
    static toString() { return _package + Config.name; }

    constructor() {
        if (new.target === Config) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {Function}
     */
    getApplicationWidgetClass() {
        throw 'Not implemented';
    }
};
