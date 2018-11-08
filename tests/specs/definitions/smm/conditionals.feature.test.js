const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const expect = require('../expect').for('smm').binary();

test('jump unconditionally', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.jmp} 0x00 0x0C 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register equal to immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x01
        ${Instruction.je} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register equal to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.movi} ${Register.edx} 0x00 0x01
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.je} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register equal to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x1C
        ${Instruction.je} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('jump if register not equal to immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x02
        ${Instruction.jne} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});


test('jump if register not equal to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.movi} ${Register.edx} 0x00 0x02
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jne} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register not equal to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x1C
        ${Instruction.jne} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x02
    `).toExitWith(1);
});

test('jump if register greater than immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x00
        ${Instruction.jg} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.movi} ${Register.edx} 0x00 0x00
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jg} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x1C
        ${Instruction.jg} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than or equal to immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x00
        ${Instruction.jge} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x01
        ${Instruction.jge} 0x00 0x20 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than or equal to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.movi} ${Register.edx} 0x00 0x00
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jge} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.edx} 0x00 0x01
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jge} 0x00 0x28 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than or equal to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x01
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x2C
        ${Instruction.jge} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movim} 0x00 0x2F 0x01
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x2C
        ${Instruction.jge} 0x00 0x24 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x01
        ${Instruction.jl} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.movi} ${Register.edx} 0x00 0x01
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jl} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x1C
        ${Instruction.jl} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('jump if register less than or equal to immediate', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x01
        ${Instruction.jle} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.cmpi} ${Register.ecx} 0x00 0x00
        ${Instruction.jle} 0x00 0x20 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than or equal to register', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.movi} ${Register.edx} 0x00 0x01
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jle} 0x00 0x18 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.edx} 0x00 0x00
        ${Instruction.cmp} ${Register.ecx} ${Register.edx} 0x00
        ${Instruction.jle} 0x00 0x28 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than or equal to memory', () => {
    return expect.program(`
        ${Instruction.movi} ${Register.eax} 0x00 0x01
        ${Instruction.movi} ${Register.ecx} 0x00 0x00
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x2C
        ${Instruction.jle} 0x00 0x14 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movim} 0x00 0x2F 0x00
        ${Instruction.cmpm} ${Register.ecx} 0x00 0x2C
        ${Instruction.jle} 0x00 0x24 0x00
        ${Instruction.movi} ${Register.eax} 0x00 0x05
        ${Instruction.movi} ${Register.ebx} 0x00 0x01
        ${Instruction.syscall} 0x00 0x00 0x00
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});
