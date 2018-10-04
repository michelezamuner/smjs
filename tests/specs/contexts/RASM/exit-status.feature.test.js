const expect = require('../expect');

test('program terminates with specific exit status', () => {
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


test('terminate program with specific exit status', () => {
    return expect.exit(`
        movi eax, 5
        mov ebx, eax
    `, 1, '', 'Missing exit instruction', 'rasm');
});
