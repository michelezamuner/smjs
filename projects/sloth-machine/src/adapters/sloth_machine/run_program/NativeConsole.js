const Console = require('./Console');

module.exports = class NativeConsole extends Console {
    /**
     * @inheritDoc
     */
    exit(text, exitStatus = 0) {
        if (text !== '') {
            const writer = exitStatus > 0 ? process.stderr : process.stdout;
            writer.write(text);
        }

        process.exit(exitStatus);
    }
};
