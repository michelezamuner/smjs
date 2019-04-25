const _package = 'SlothMachine.SlothMachineFramework.Data.';

const Integer = require('../data/Integer');

module.exports = class Size extends Integer {
    static toString() { return _package + Size.name; }
};
