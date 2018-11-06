const DataType = require('../../src/DataTypes/DataType');

/**
 * @param {DataType} dataType
 * @param {number} min
 * @param {number} maxOffsetFromTop
 * @returns {number}
 */
module.exports = (dataType, min = 0, maxOffsetFromTop = 0) => {
    const maxValue = 2 ** (8 * dataType.SIZE) - 1 - min;
    const value = Math.floor(Math.random() * maxValue) + min;
    const cap = (maxValue + min) - maxOffsetFromTop;

    return value < cap ? value : cap;
};
