const _package = 'SensorSystem.FileActuator.';

/**
 * @interface
 */
module.exports = class Writer {
    static toString() { return _package + Writer.name; }

    constructor() {
        if (new.target === Writer) {
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
