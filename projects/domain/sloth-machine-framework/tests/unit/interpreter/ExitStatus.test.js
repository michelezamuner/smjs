const ExitStatus = require('../../../src/interpreter/ExitStatus');
const Integer = require('../../../src/data/Integer');

test('is integer', () => {
    const exitStatus = new ExitStatus();

    expect(exitStatus).toBeInstanceOf(Integer);
});
