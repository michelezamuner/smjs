const DataType = require('./DataType');

module.exports = class Double extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 2147483647;
    }

    /**
     * @param {number|Double} value
     */
    constructor(value) {
        super(value);
    }
};
