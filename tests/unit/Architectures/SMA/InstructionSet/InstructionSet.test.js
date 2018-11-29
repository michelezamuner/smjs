const InstructionSet = require('../../../../../src/Architectures/SMA/InstructionSet/InstructionSet');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const System = require('../../../../../src/Architectures/SMA/System');

/**
 * @type {Object}
 */
const loader = {};

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
 * @type {Object}
 */
const dependencies = {
    getRegisters: () => registers,
    getMemory: () => memory,
    getSystem: () => system,
};

/**
 * @type {null|InstructionSet}
 */
let instructionSet = null;

beforeEach(() => {
    instructionSet = new InstructionSet(loader, dependencies);
});

test('creates instructions with single dependency', () => {
    const definition = class extends Definition {
        static getDependencies() {
            return [Registers];
        }

        constructor(registers) {
            super();
            this.registers = registers;
        }
    };
    const instructionName = 'instruction';
    const definitionName = 'Instruction';

    loader.load = name => name === definitionName ? definition : null;

    const def = instructionSet.get(instructionName);

    expect(def).toBeInstanceOf(definition);
    expect(def.registers).toBe(registers);
});

test('creates instructions with multiple dependencies', () => {
    const definition = class extends Definition {
        static getDependencies() {
            return [Registers, Memory, System];
        }

        constructor(registers, memory, system) {
            super();
            this.registers = registers;
            this.memory = memory;
            this.system = system;
        }
    };
    const instructionName = 'instruction';
    const definitionName = 'Instruction';

    loader.load = name => name === definitionName ? definition : null;

    const def = instructionSet.get(instructionName);

    expect(def).toBeInstanceOf(definition);
    expect(def.registers).toBe(registers);
    expect(def.memory).toBe(memory);
    expect(def.system).toBe(system);
});
