const _package = 'SensorSystem.FileActuator.';

const Writer = require('./Writer');
const fs = require('fs');

module.exports = class NativeWriter extends Writer {
    static toString() { return _package + NativeWriter.name; }
    /**
     * @override
     */
    write(file, content) {
        fs.writeFileSync(file, content);
    }
};
