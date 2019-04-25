const ProgramLoader = require('../../src/ProgramLoader');
const InvalidProgramException = require('../../src/InvalidProgramException');

test('provides fqcn', () => {
    expect(ProgramLoader.toString()).toBe('SlothMachine.ProgramLoader.ProgramLoader');
    expect(InvalidProgramException.toString()).toBe('SlothMachine.ProgramLoader.InvalidProgramException');
});
