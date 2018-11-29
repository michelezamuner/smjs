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

test('call procedure with no parameters and no return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x0C 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.ret} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('call procedure with no parameters and immediate return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.reti} 0x00 0x01 0x00
    `).toExitWith(1);
});

test('call procedure with no parameters and register return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.retr} ${Register.ecx}
    `).toExitWith(1);
});

test('call procedure with no parameters and memory byte return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bl} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmb} 0x00 0x14 0x00
        0x01
    `).toExitWith(1);
});

test('call procedure with no parameters and memory word return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmw} 0x00 0x14 0x00
        0x00 0x01
    `).toExitWith(1);
});

test('call procedure with no parameters and memory double return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmd} 0x00 0x14 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});
