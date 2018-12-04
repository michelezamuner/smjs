const DataType = require('../../src/DataTypes/DataType');

/**
 * @param {function} dataType
 * @param {number} min
 * @param {number} minOffsetFromTop
 * @returns {DataType}
 */
module.exports = (dataType, min = 0, minOffsetFromTop = 0) => {
    const maxValue = 2 ** (8 * dataType.SIZE) - 1 - min;
    const value = Math.floor(Math.random() * maxValue) + min;
    const cap = (maxValue + min) - minOffsetFromTop;

    return new dataType(value < cap ? value : cap);
};
