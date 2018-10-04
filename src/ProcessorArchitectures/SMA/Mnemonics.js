const Byte = require('../../DataTypes/Byte');

module.exports = {
    mov: new Byte(0x00),
    movi: new Byte(0x01),
    movmb: new Byte(0x02),
    movmw: new Byte(0x03),
    syscall: new Byte(0x10),
};
