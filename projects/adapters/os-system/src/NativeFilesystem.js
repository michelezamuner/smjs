const _package = 'SlothMachine.OSSystem.';

const Filesystem = require('./Filesystem');
const fs = require('fs');

module.exports = class NativeFilesystem extends Filesystem {
    static toString() { return _package + NativeFilesystem.name; }

    /**
     * @override
     */
    write(fd, buf, count) {
        return fs.writeSync(fd, buf, 0, count);
    }
};
