const ExitStatus = require('../../../../../src/domain/sloth-machine-framework/interpreter/ExitStatus');
const Integer = require('../../../../../src/domain/sloth-machine-framework/data/Integer');

test('is integer', () => {
    const exitStatus = new ExitStatus();

    expect(exitStatus).toBeInstanceOf(Integer);
});
