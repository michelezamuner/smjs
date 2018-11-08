const expect = require('../expect').for('rasm');

test('print message to the standard output', () => {
    return expect.program(`
        movi eax, 4
        movi ebx, 1
        movi ecx, 0x20
        movi edx, 13
        syscall
        mov ebx, eax
        movi eax, 1
        syscall
        0x48 0x65 0x6C 0x6C
        0x6F 0x2C 0x20 0x57
        0x6F 0x72 0x6C 0x64
        0x21
    `).toExitWith(13, 'Hello, World!');
});
