const Actuator = require('../../application/actuator/Actuator');
const Writer = require('./Writer');

module.exports = class FileActuator_FileActuator extends Actuator
{
    /**
     * @param {Writer} writer
     * @param {string} outputFile
     */
    constructor(writer, outputFile) {
        super();
        this._writer = writer;
        this._outputFile = outputFile;
    }

    /**
     * @override
     */
    activate(signal) {
        this._writer.write(this._outputFile, signal.getValue());
    }
};
