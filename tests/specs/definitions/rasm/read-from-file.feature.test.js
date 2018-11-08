const expect = require('../expect').for('rasm');

test('read value from the standard input', () => {
    return expect.program(`
        movi eax, 3
        movi ebx, 0
        movi ecx, 0x20
        movi edx, 1
        syscall
        movm bl, 0x20
        movi eax, 1
        syscall
    `)
        .withInput('#')
        .toExitWith(35);
});

