const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const expect = require('../expect').for('smm').binary();

test('increment register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x00
        ${Instruction.inc} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('decrement regiser', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x02
        ${Instruction.dec} ${Register.ebx} 0x00 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('add immediate to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x00
        ${Instruction.addi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('add register to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x00
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.add} ${Register.ebx} ${Register.ecx} 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('add memory to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x00
        ${Instruction.addm} ${Register.ebx} 0x00 0x10
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('subtract immediate from register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x02
        ${Instruction.subi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('subtract register from register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x02
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.sub} ${Register.ebx} ${Register.ecx} 0x00
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('subtract memory from register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ebx} 0x00 0x02
        ${Instruction.subm} ${Register.ebx} 0x00 0x10
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

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
        ${Instruction.movi} ${Register.bx} 0x12 0x34
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

test('multiply register byte by register byte', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.al} 0x00 0x12
        ${Instruction.movi} ${Register.bl} 0x00 0x34
        ${Instruction.mul} ${Register.bl} ${Register.al} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0xa8);
});

test('multiply register word by register word', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.ax} 0x12 0x34
        ${Instruction.movi} ${Register.bx} 0x56 0x78
        ${Instruction.mul} ${Register.bx} ${Register.ax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0x60);
});

test('multiply register double by register double', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0xFE 0xDC
        ${Instruction.movi} ${Register.ebx} 0xBA 0x98
        ${Instruction.mul} ${Register.ebx} ${Register.eax} 0x00
        ${Instruction.mov} ${Register.ebx} ${Register.edx} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0xa0);
});

test('multiply register double by register double with alternate register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0xFE 0xDC
        ${Instruction.movi} ${Register.edx} 0xBA 0x98
        ${Instruction.mul} ${Register.edx} ${Register.eax} 0x00
        ${Instruction.mov} ${Register.ebx} ${Register.eax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(0xa0);
});

test('multiply register byte by memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.bl} 0x00 0x34
        ${Instruction.mulm} ${Register.bl} 0x00 0x10
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x12
    `).toExitWith(0xa8);
});

test('multiply register word by memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.bx} 0x56 0x78
        ${Instruction.mulm} ${Register.bx} 0x00 0x10
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x12 0x34
    `).toExitWith(0x60);
});

test('multiply register double by memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.ebx} 0x76 0x54
        ${Instruction.mulm} ${Register.ebx} 0x00 0x14
        ${Instruction.mov} ${Register.ebx} ${Register.edx} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0xFE 0xDC 0xBA 0x98
    `).toExitWith(0xe0);
});

test('multiply register double by memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.edx} 0x76 0x54
        ${Instruction.mulm} ${Register.edx} 0x00 0x14
        ${Instruction.mov} ${Register.ebx} ${Register.eax} 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0xFE 0xDC 0xBA 0x98
    `).toExitWith(0xe0);
});
