const Byte = require('../../DataTypes/Byte');
const addresses = require('./RegisterAddress').generate(4);

module.exports = {
    eax: addresses[0].whole,
    ax: addresses[0].half,
    ah: addresses[0].leftq,
    al: addresses[0].rightq,
    ebx: addresses[1].whole,
    bx: addresses[1].half,
    bh: addresses[1].leftq,
    bl: addresses[1].rightq,
    ecx: addresses[2].whole,
    cx: addresses[2].half,
    ch: addresses[2].leftq,
    cl: addresses[2].rightq,
    edx: addresses[3].whole,
    dx: addresses[3].half,
    dh: addresses[3].leftq,
    dl: addresses[3].rightq,
    mov: new Byte(0x00),
    movi: new Byte(0x01),
    movim: new Byte(0x02),
    movipb: new Byte(0x03),
    movipw: new Byte(0x04),
    movm: new Byte(0x06),
    movrm: new Byte(0x09),
    syscall: new Byte(0x10),
};
