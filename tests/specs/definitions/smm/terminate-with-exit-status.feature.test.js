const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('../expect').for('smm').binary();

test('program is terminated with specific exit status', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x05
        ${Instruction.movi} ${Register.ecx} 0x00 0x03
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x04
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('program is never terminated', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.mov} ${Register.ebx} ${Register.eax} 0x00
    `).toExitWith(127, '', 'Missing exit instruction');
});
