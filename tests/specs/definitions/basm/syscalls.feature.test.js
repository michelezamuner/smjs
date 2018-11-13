const expect = require('../expect').for('basm');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        .data
        .text
            mov eax, 1
            mov ebx, 5
            mov ecx, 3
            syscall
            mov eax, 1
            mov ebx, 4
            syscall
    `).toExitWith(5);
});

test('an error happens if program is never terminated', () => {
    return expect.program(`
        .data
        .text
            mov eax, 5
            mov ebx, eax
    `).toExitWith(127, '', 'Missing exit instruction');
});

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
