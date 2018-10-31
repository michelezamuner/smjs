const Byte = require('../../DataTypes/Byte');
const addresses = require('./RegisterAddress').generate(4);

module.exports = {
    register: {
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
    },
    instruction: {
        mov: new Byte(0x00),
        movi: new Byte(0x01),
        movim: new Byte(0x02),
        movipb: new Byte(0x03),
        movipw: new Byte(0x04),
        movipd: new Byte(0x05),
        movimp: new Byte(0x06),
        movm: new Byte(0x07),
        movp: new Byte(0x08),
        movrm: new Byte(0x09),
        movrp: new Byte(0x0A),
        movrmp: new Byte(0x0B),
        muli: new Byte(0x10),
        syscall: new Byte(0x20),
    },
};
