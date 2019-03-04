/**
 * @interface
 */
module.exports = class FileHandlerWriter {
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
