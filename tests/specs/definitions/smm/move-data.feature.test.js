const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const expect = require('./expect');

test('move register to register', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0x04
        ${Mnemonics.mov.uint()} ${Mnemonics.ebx.uint()} ${Mnemonics.ecx.uint()} 0x00
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(4);
});

test('move immediate to register', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ebx.uint()} 0x00 0x05
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('move immediate to memory', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movim.uint()} 0x00 0x13 0x54
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x10
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54)
});

test('move immediate to byte register pointer', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.cx.uint()} 0x00 0x17
        ${Mnemonics.movipb.uint()} ${Mnemonics.cx.uint()} 0x00 0x54
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x14
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to word register pointer', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.cx.uint()} 0x00 0x16
        ${Mnemonics.movipw.uint()} ${Mnemonics.cx.uint()} 0x00 0x54
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x14
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to double register pointer', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.cx.uint()} 0x00 0x14
        ${Mnemonics.movipd.uint()} ${Mnemonics.cx.uint()} 0x00 0x54
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x14
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to memory pointer', () => {
    return expect.program(`
        ${Mnemonics.movimp.uint()} 0x00 0x14 0x54
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x10
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00 0x00 0x13
    `).toExitWith(0x54);
});

test('move memory to register', () => {
    return expect.program(`
        ${Mnemonics.movm.uint()} ${Mnemonics.eax.uint()} 0x00 0x0C
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x10
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register pointer to register', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.cx.uint()} 0x00 0x10
        ${Mnemonics.movp.uint()} ${Mnemonics.ebx.uint()} ${Mnemonics.cx.uint()} 0x00
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register to memory', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0xFE
        ${Mnemonics.movrm.uint()} 0x00 0x14 ${Mnemonics.ecx.uint()}
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x14
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to register pointer', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0xFE
        ${Mnemonics.movi.uint()} ${Mnemonics.dx.uint()} 0x00 0x18
        ${Mnemonics.movrp.uint()} ${Mnemonics.dx.uint()} ${Mnemonics.ecx.uint()} 0x00
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x18
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to memory pointer', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0xFE
        ${Mnemonics.movrmp.uint()} 0x00 0x18 ${Mnemonics.ecx.uint()}
        ${Mnemonics.movm.uint()} ${Mnemonics.ebx.uint()} 0x00 0x14
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00
        0x00 0x14
    `).toExitWith(0xFE);
});
