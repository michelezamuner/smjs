const InstructionSet = require('../../../../../src/Architectures/SMA/InstructionSet/InstructionSet');

/**
 * @type {Object}
 */
const loader = {};

/**
 * @type {Object}
 */
const dependencies = {};

/**
 * @type {null|InstructionSet}
 */
let instructionSet = null;

beforeEach(() => {
    instructionSet = new InstructionSet(loader, dependencies);
});

test('creates instructions with correct dependencies', () => {
    const definition = class {
        constructor(dependencies) {
            this.dependencies = dependencies;
        }
    };
    const opcode = 'opcode';

    loader.load = opc => opc === opcode ? definition : null;

    const def = instructionSet.get(opcode);

    expect(def).toBeInstanceOf(definition);
    expect(def.dependencies).toBe(dependencies);
});
