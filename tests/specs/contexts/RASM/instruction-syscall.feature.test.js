const expect = require('../expect');

test('call sys_exit with specific exit status', () => {
    return expect.exit(`
        movi eax, 1
        movi ebx, 5
        movi ecx, 3
        syscall
        movi eax, 1
        movi ebx, 4
        syscall
    `, 5, '', '', 'rasm')
});


test('sys_exit is never called', () => {
    return expect.exit(`
        movi eax, 5
        mov ebx, eax
    `, 1, '', 'Missing exit instruction', 'rasm');
});

test('call sys_write to print to STDOUT', () => {
    return expect.exit(`
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
    `, 13, 'Hello, World!', '', 'rasm');
});
