const expect = require('../expect').for('rasm');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 5
        movi ecx, 3
        syscall
        movi eax, 1
        movi ebx, 4
        syscall
    `).toExitWith(5);
});

test('an error happens if program is never terminated', () => {
    return expect.program(`
        movi eax, 5
        mov eax, ebx
    `).toExitWith(127, '', 'Missing exit instruction');
});

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
