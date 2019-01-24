module.exports = class System {
    /**
     * Exit the current process printing the given text, with the given exit status.
     *
     * If the given exit status is greater than 0, the given text will be printed to STDERR; otherwise it will be
     * printed to STDOUT.
     *
     * @param {string} text
     * @param {number} [exitStatus=0]
     */
    exit(text, exitStatus = 0) {
        throw 'Not implemented';
    }
};
