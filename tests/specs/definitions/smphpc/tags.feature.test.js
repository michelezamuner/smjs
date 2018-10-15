const expect = require('./expect');

test('text with no PHP block tag is printed to the standard output', () => {
    return expect.program(`
        Some text with no PHP tag
    `).toExitWith(0, 'Some text with no PHP tag');
});
