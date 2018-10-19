const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ebx.uint()} 0x00 0x05
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0x03
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ebx.uint()} 0x00 0x04
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('program is never terminated', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x05
        ${Instruction.mov.uint()} ${Register.ebx.uint()} ${Register.eax.uint()} 0x00
    `).toExitWith(127, '', 'Missing exit instruction');
});
