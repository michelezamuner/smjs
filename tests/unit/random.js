const DataType = require('../../src/DataTypes/DataType');

/**
 * @param {DataType} dataType
 * @param {number} min
 * @param {number} cap
 * @returns {number}
 */
module.exports = (dataType, min = 0, cap = 0) => {
    const maxValue = 2 ** (8 * dataType.SIZE) - 1 - min;
    const value = Math.floor(Math.random() * maxValue) + min;
    return value < cap ? value : value - cap;
};
