const expect = require('../expect').for('basm');

test('print message to the standard output', () => {
    return expect.program(`
        .data
            msg     db  "Hello, World!"
        .text
            mov eax, 4
            mov ebx, 1
            mov ecx, [msg]
            mov edx, 13
            syscall
            mov ebx, eax
            mov eax, 1
            syscall
    `).toExitWith(13, 'Hello, World!');
});
