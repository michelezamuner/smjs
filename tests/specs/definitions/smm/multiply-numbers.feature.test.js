const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('multiply register byte by immediate byte', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.al} 0x00 0x12
        ${Instruction.muli} ${Register.al} 0x00 0x34
        ${Instruction.mov} ${Register.bx} ${Register.ax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall}
    `).toExitWith(0xa8);
});

test('multiply register word by immediate word', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.ebx} 0x12 0x34
        ${Instruction.muli} ${Register.bx} 0x56 0x78
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall}
    `).toExitWith(0x60);
});

test('multiply register double by immediate word', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.ebx} 0xFE 0xDC
        ${Instruction.muli} ${Register.ebx} 0xBA 0x98
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.mov} ${Register.ebx} ${Register.edx} 0x00
        ${Instruction.syscall}
    `).toExitWith(0xa0);
});

test('multiply register double by immediate word with alternate register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.edx} 0xFE 0xDC
        ${Instruction.muli} ${Register.edx} 0xBA 0x98
        ${Instruction.mov} ${Register.ebx} ${Register.eax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall}
    `).toExitWith(0xa0);
});
