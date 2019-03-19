/**
 * @interface
 */
module.exports = class FileActuator_Writer {
    constructor() {
        if (new.target === FileActuator_Writer) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} file
     * @param {string} content
     */
    write(file, content) {
        throw 'Not implemented';
    }
};
