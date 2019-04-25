const _package = 'SlothMachine.SlothMachineFramework.Interpreter.';

const Integer = require('../data/Integer');

module.exports = class ExitStatus extends Integer {
    static toString() { return _package + ExitStatus.name; }
};
