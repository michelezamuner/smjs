const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('print message to the standard output', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x04
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x1E
        ${Instruction.movi} ${Register.edx} 0x00 0x0D
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.mov} ${Register.ebx} ${Register.eax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(13, 'Hello, World!');
});
