const Byte = require('../../src/Processor/DataTypes/Byte');

module.exports = {
    'mov': new Byte(0x00),
    'movi': new Byte(0x01),
    'syscall': new Byte(0x10),
};
