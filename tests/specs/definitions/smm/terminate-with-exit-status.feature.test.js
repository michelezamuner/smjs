const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const expect = require('./expect');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ebx.uint()} 0x00 0x05
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0x03
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ebx.uint()} 0x00 0x04
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(5);
});

test('program is never terminated', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x05
        ${Mnemonics.mov.uint()} ${Mnemonics.ebx.uint()} ${Mnemonics.eax.uint()} 0x00
    `).toExitWith(127, '', 'Missing exit instruction');
});
