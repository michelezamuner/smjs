const _package = 'SlothMachine.SlothMachineFramework.Data.';

const Integer = require('../data/Integer');

module.exports = class Address extends Integer {
    static toString() { return _package + Address.name; }

    /**
     * @inheritDoc
     */
    add(address) {
        return new Address(super.add(address));
    }
};
