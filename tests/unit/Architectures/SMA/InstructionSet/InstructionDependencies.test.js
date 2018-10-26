const InstructionDependencies = require('../../../../../src/Architectures/SMA/InstructionSet/InstructionDependencies');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const system = {};

/**
 * @type {null|InstructionDependencies}
 */
let dependencies = null;

beforeEach(() => {
    dependencies = new InstructionDependencies(registers, memory, system);
});

test('provides dependencies', () => {
    expect(dependencies.getRegisters()).toBe(registers);
    expect(dependencies.getMemory()).toBe(memory);
    expect(dependencies.getSystem()).toBe(system);
});
