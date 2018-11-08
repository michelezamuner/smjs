const expect = require('../expect').for('basm');

test('read value from the standard input', () => {
    return expect.program(`
        .bss
            x   db
        .text
            mov eax, 3
            mov ebx, 0
            mov ecx, [x]
            mov edx, 1
            syscall
            mov bl, x
            mov eax, 1
            syscall
    `)
        .withInput('#')
        .toExitWith(35);
});

