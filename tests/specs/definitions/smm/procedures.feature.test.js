const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const expect = require('../expect').for('smm').binary();

test('call procedure with no parameters and that does not return', () => {
    return expect.program(`
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x02
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});
