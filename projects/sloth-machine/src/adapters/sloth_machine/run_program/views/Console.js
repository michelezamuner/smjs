module.exports = class Console {
    static get ERROR_EXIT_STATUS() { return 127; }
    static get STREAM_STDOUT() { return 1; }
    static get STREAM_STDERR() { return 2; }

    /**
     * @param {string} text
     * @param {number} [stream=Console.STREAM_STDOUT]
     */
    write(text, stream = Console.STREAM_STDOUT) {
        throw 'Not implemented';
    }

    /**
     * @param {number} [exitStatus=0]
     */
    exit(exitStatus = 0) {
        throw 'Not implemented';
    }
};
