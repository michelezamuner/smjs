const _package = 'SlothMachine.SlothMachineFramework.Interpreter.';

const Data = require('../data/Data');

module.exports = class Operands extends Data {
    static toString() { return _package + Operands.name; }
};
