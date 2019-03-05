const Integer = require('../data/Integer');

module.exports = class SlothMachineFramework_Data_Address extends Integer {
    /**
     * @inheritDoc
     */
    add(address) {
        return new Address(super.add(address));
    }
};
