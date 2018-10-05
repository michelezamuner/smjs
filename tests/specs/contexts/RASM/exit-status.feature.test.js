const expect = require('../expect');

test('program terminates with specific exit status', () => {
    return expect.exit(`
        movi al, 1
        movi bl, 5
        movi cl, 3
        syscall
        movi al, 1
        movi bl, 4
        syscall
    `, 5, '', '', 'rasm')
});


test('terminate program with specific exit status', () => {
    return expect.exit(`
        movi al, 5
        mov bl, al
    `, 1, '', 'Missing exit instruction', 'rasm');
});
