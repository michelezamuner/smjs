const Byte = require('../../DataTypes/Byte');

module.exports = {
    eax: new Byte(0x00),
    ebx: new Byte(0x01),
    ecx: new Byte(0x02),
    edx: new Byte(0x03),
    mov: new Byte(0x00),
    movi: new Byte(0x01),
    movim: new Byte(0x04),
    movmb: new Byte(0x02),
    movmw: new Byte(0x03),
    movrm: new Byte(0x05),
    syscall: new Byte(0x10),
};
