const DataType = require('./DataType');

module.exports = class Word extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 32767;
    }

    /**
     * @param {number|Word} value
     */
    constructor(value) {
        super(value);
    }
};
