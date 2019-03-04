const Integer = require('../data/Integer');

module.exports = class Address extends Integer {
    /**
     * @inheritDoc
     */
    add(address) {
        return new Address(super.add(address));
    }
};
