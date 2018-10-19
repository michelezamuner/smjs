const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('move register to register', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0x04
        ${Instruction.mov.uint()} ${Register.ebx.uint()} ${Register.ecx.uint()} 0x00
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(4);
});

test('move immediate to register', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ebx.uint()} 0x00 0x05
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('move immediate to memory', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movim.uint()} 0x00 0x13 0x54
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x10
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54)
});

test('move immediate to byte register pointer', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.cx.uint()} 0x00 0x17
        ${Instruction.movipb.uint()} ${Register.cx.uint()} 0x00 0x54
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x14
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to word register pointer', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.cx.uint()} 0x00 0x16
        ${Instruction.movipw.uint()} ${Register.cx.uint()} 0x00 0x54
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x14
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to double register pointer', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.cx.uint()} 0x00 0x14
        ${Instruction.movipd.uint()} ${Register.cx.uint()} 0x00 0x54
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x14
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to memory pointer', () => {
    return expect.program(`
        ${Instruction.movimp.uint()} 0x00 0x14 0x54
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x10
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00 0x00 0x13
    `).toExitWith(0x54);
});

test('move memory to register', () => {
    return expect.program(`
        ${Instruction.movm.uint()} ${Register.eax.uint()} 0x00 0x0C
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x10
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register pointer to register', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.cx.uint()} 0x00 0x10
        ${Instruction.movp.uint()} ${Register.ebx.uint()} ${Register.cx.uint()} 0x00
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register to memory', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0xFE
        ${Instruction.movrm.uint()} 0x00 0x14 ${Register.ecx.uint()}
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x14
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to register pointer', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0xFE
        ${Instruction.movi.uint()} ${Register.dx.uint()} 0x00 0x18
        ${Instruction.movrp.uint()} ${Register.dx.uint()} ${Register.ecx.uint()} 0x00
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x18
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to memory pointer', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0xFE
        ${Instruction.movrmp.uint()} 0x00 0x18 ${Register.ecx.uint()}
        ${Instruction.movm.uint()} ${Register.ebx.uint()} 0x00 0x14
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00
        0x00 0x14
    `).toExitWith(0xFE);
});
