const Writer = require('./Writer');
const fs = require('fs');

module.exports = class NativeWriter extends Writer {
    /**
     * @override
     */
    write(file, content) {
        fs.writeFileSync(file, content);
    }
};
