/**
 * @interface
 */
module.exports = class Interpreter {
    /**
     * Execute the instruction currently stored in the Instruction Register.
     */
    exec() {
        throw 'Not implemented';
    }
};
