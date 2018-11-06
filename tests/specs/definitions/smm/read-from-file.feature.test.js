const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('./expect');

test('read value from the standard input', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x03
        ${Instruction.movi} ${Register.ebx} 0x00 0x00
        ${Instruction.movi} ${Register.ecx} 0x00 0x20
        ${Instruction.movi} ${Register.edx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movm} ${Register.bl} 0x00 0x20
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `)
        .withInput('#')
        .toExitWith(35);
});

