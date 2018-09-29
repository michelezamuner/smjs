const DataType = require('../../src/DataTypes/DataType');

/**
 * @param {DataType} dataType
 * @param {number} min
 * @returns {number}
 */
module.exports = (dataType, min = 0) => {
    return Math.floor(Math.random() * ((2 ** (8 * dataType.SIZE)) - 1 - min)) + min;
};
