const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const expect = require('./expect');

test('print message to the standard output', () => {
    return expect.program(`
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x04
        ${Mnemonics.movi.uint()} ${Mnemonics.ebx.uint()} 0x00 0x01
        ${Mnemonics.movi.uint()} ${Mnemonics.ecx.uint()} 0x00 0x1E
        ${Mnemonics.movi.uint()} ${Mnemonics.edx.uint()} 0x00 0x0D
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
        ${Mnemonics.mov.uint()} ${Mnemonics.ebx.uint()} ${Mnemonics.eax.uint()} 0x00
        ${Mnemonics.movi.uint()} ${Mnemonics.eax.uint()} 0x00 0x01
        ${Mnemonics.syscall.uint()} 0x00 0x00 0x00
    `).toExitWith(13, 'Hello, World!');
});
