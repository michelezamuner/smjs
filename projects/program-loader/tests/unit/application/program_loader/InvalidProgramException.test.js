const InvalidProgramException = require('../../../../src/application/program_loader/InvalidProgramException');

test('contains program reference', () => {
    const programReference = 'program';
    const exception = new InvalidProgramException(programReference);

    expect(exception.getProgramReference()).toBe(programReference);
});
