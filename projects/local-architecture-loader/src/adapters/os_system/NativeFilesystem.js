const Filesystem = require('./Filesystem');
const fs = require('fs');

module.exports = class NativeFilesystem extends Filesystem {
    /**
     * @inheritDoc
     */
    write(fd, buf, count) {
        return fs.writeSync(fd, buf, 0, count);
    }
};
