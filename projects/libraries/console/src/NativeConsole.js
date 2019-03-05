const Console = require('./Console');

module.exports = class Console_NativeConsole extends Console {
    /**
     * @override
     */
    write(message) {
        process.stdout.write(message);
    }

    /**
     * @override
     */
    writeError(message) {
        process.stderr.write(message);
    }

    /**
     * @override
     */
    exit(exitStatus = 0) {
        process.exit(exitStatus);
    }
};
