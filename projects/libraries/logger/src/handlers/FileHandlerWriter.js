/**
 * @interface
 */
module.exports = class Logger_Handlers_FileHandlerWriter {
    constructor() {
        if (new.target === Logger_Handlers_FileHandlerWriter) {
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
