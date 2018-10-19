const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('print message to the standard output', () => {
    return expect.program(`
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x04
        ${Instruction.movi.uint()} ${Register.ebx.uint()} 0x00 0x01
        ${Instruction.movi.uint()} ${Register.ecx.uint()} 0x00 0x1E
        ${Instruction.movi.uint()} ${Register.edx.uint()} 0x00 0x0D
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
        ${Instruction.mov.uint()} ${Register.ebx.uint()} ${Register.eax.uint()} 0x00
        ${Instruction.movi.uint()} ${Register.eax.uint()} 0x00 0x01
        ${Instruction.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(13, 'Hello, World!');
});
