const _package = 'ConsoleWrapper.';

const Console = require('./Console');

module.exports = class NativeConsole extends Console {
    static toString() { return _package + NativeConsole.name; }

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
