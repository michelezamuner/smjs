const Interpreter = require('../interpreter/Interpreter');
const Loader = require('../interpreter/Loader');

module.exports = class Architecture {
    /**
     * @return {Interpreter}
     */
    getInterpreter() {
        throw 'Not implemented';
    }

    /**
     * @return {Loader}
     */
    getLoader() {
        throw 'Not implemented';
    }
};
