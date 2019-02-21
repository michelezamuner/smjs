const Console = require('../adapters/sloth_machine/run_program/views/Console');

module.exports = class NativeConsole extends Console {
    /**
     * @inheritDoc
     */
    write(text, stream = Console.STREAM_STDOUT) {
        switch (stream) {
            case Console.STREAM_STDOUT:
                process.stdout.write(text);
                break;
            case Console.STREAM_STDERR:
                process.stderr.write(text);
                break;
        }
    }

    /**
     * @inheritDoc
     */
    exit(exitStatus = 0) {
        process.exit(exitStatus);
    }
};
