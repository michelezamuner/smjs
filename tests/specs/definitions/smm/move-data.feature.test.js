const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('../expect').for('smm').binary();

test('move register to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x04
        ${Instruction.mov} ${Register.ebx} ${Register.ecx} 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(4);
});

test('move immediate to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x05
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('move immediate to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movim} 0x00 0x13 0x54
        ${Instruction.movm} ${Register.ebx} 0x00 0x10
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0x54)
});

test('move immediate to byte register pointer', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.cx} 0x00 0x17
        ${Instruction.movipb} ${Register.cx} 0x00 0x54
        ${Instruction.movm} ${Register.ebx} 0x00 0x14
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to word register pointer', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.cx} 0x00 0x16
        ${Instruction.movipw} ${Register.cx} 0x00 0x54
        ${Instruction.movm} ${Register.ebx} 0x00 0x14
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to double register pointer', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.cx} 0x00 0x14
        ${Instruction.movipd} ${Register.cx} 0x00 0x54
        ${Instruction.movm} ${Register.ebx} 0x00 0x14
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0x54);
});

test('move immediate to memory pointer', () => {
    return expect.program(`
        ${Instruction.movimp} 0x00 0x14 0x54
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movm} ${Register.ebx} 0x00 0x10
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00 0x00 0x13
    `).toExitWith(0x54);
});

test('move memory to register', () => {
    return expect.program(`
        ${Instruction.movm} ${Register.eax} 0x00 0x0C
        ${Instruction.movm} ${Register.ebx} 0x00 0x10
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register pointer to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.cx} 0x00 0x10
        ${Instruction.movp} ${Register.ebx} ${Register.cx} 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0xA2
    `).toExitWith(0xA2);
});

test('move register to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0xFE
        ${Instruction.movrm} 0x00 0x14 ${Register.ecx}
        ${Instruction.movm} ${Register.ebx} 0x00 0x14
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to register pointer', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0xFE
        ${Instruction.movi} ${Register.dx} 0x00 0x18
        ${Instruction.movrp} ${Register.dx} ${Register.ecx} 0x00
        ${Instruction.movm} ${Register.ebx} 0x00 0x18
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0xFE);
});

test('move register to memory pointer', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0xFE
        ${Instruction.movrmp} 0x00 0x18 ${Register.ecx}
        ${Instruction.movm} ${Register.ebx} 0x00 0x14
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00
        0x00 0x14
    `).toExitWith(0xFE);
});
