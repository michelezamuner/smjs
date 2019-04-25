const _package = 'Logger.Handlers.';

/**
 * @interface
 */
module.exports = class FileHandlerWriter {
    static toString() { return _package + FileHandlerWriter.name; }

    constructor() {
        if (new.target === FileHandlerWriter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} file
     * @param {string} data
     * @param {Object} options
     */
    write(file, data, options) {
        throw 'Not implemented';
    }
};
