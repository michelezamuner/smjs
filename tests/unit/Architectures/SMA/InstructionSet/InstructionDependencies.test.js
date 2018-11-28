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
const stack = {};

/**
 * @type {Object}
 */
const system = {};

/**
 * @type {null|InstructionDependencies}
 */
let dependencies = null;

beforeEach(() => {
    dependencies = new InstructionDependencies(registers, memory, stack, system);
});

test('provides dependencies', () => {
    expect(dependencies.getRegisters()).toBe(registers);
    expect(dependencies.getMemory()).toBe(memory);
    expect(dependencies.getStack()).toBe(stack);
    expect(dependencies.getSystem()).toBe(system);
});
