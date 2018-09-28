const DataType = require('./DataType');

module.exports = class Double extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 4294967295;
    }

    /**
     * @param {number|Double} value
     */
    constructor(value) {
        super(value);
    }
};
