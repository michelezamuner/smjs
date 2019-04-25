const _package = 'SlothMachine.SlothMachineFramework.Interpreter.';

const Data = require('../data/Data');

module.exports = class Opcode extends Data {
    static toString() { return _package + Opcode.name; }
};
