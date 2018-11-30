const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const expect = require('../expect').for('smm').binary();

test('call procedure with no arguments and that does not return', () => {
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

test('call procedure with no arguments and no return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x0C 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.ret} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('call procedure with no arguments and immediate return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.reti} 0x00 0x01 0x00
    `).toExitWith(1);
});

test('call procedure with no arguments and register return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.retr} ${Register.ecx}
    `).toExitWith(1);
});

test('call procedure with no arguments and memory byte return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bl} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmb} 0x00 0x14 0x00
        0x01
    `).toExitWith(1);
});

test('call procedure with no arguments and memory word return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.bx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmw} 0x00 0x14 0x00
        0x00 0x01
    `).toExitWith(1);
});

test('call procedure with no arguments and memory double return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.call} 0x00 0x10 0x00
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.retmd} 0x00 0x14 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('call procedure with arguments and return value', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x02
        ${Instruction.pushi} 0x00 0x01 0x00
        ${Instruction.push} ${Register.eax} 0x00 0x00
        ${Instruction.pushmw} 0x00 0x40 0x00
        ${Instruction.calla} 0x00 0x20 0x08
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        ${Instruction.pop} ${Register.cx} 0x00 0x00
        ${Instruction.pop} ${Register.ebx} 0x00 0x00
        ${Instruction.pop} ${Register.ax} 0x00 0x00
        ${Instruction.movi} ${Register.edx} 0x00 0x00
        ${Instruction.add} ${Register.edx} ${Register.ax} 0x00
        ${Instruction.add} ${Register.edx} ${Register.ebx} 0x00
        ${Instruction.add} ${Register.edx} ${Register.cx} 0x00
        ${Instruction.retr} ${Register.edx} 0x00 0x00
        0x00 0x03
    `).toExitWith(6);
});
