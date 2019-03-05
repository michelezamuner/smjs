const Filesystem = require('./Filesystem');
const fs = require('fs');

module.exports = class OSSystem_NativeFilesystem extends Filesystem {
    /**
     * @override
     */
    write(fd, buf, count) {
        return fs.writeSync(fd, buf, 0, count);
    }
};
