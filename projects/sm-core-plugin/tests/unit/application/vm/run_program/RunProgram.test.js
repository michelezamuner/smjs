const RunProgram = require('../../../../../src/application/vm/run_program/RunProgram');
const ArchitectureLoader = require('../../../../../src/application/architecture/ArchitectureLoader');

/**
 * @type {Object}
 */
const architectureLoader = {};

/**
 * @type {null|RunProgram}
 */
let service = null;

/**
 * @type {Object}
 */
const architecture = {};

/**
 * @type {Object}
 */
const programLoader = {};

/**
 * @type {string}
 */
const architectureName = 'architecture';

beforeEach(() => {
    programLoader.load = () => {};
    architecture.getLoader = () => programLoader;
    architectureLoader.load = jest.fn(name => name === architectureName ? architecture : null);
    service = new RunProgram(architectureLoader);
});

test('can be injected', () => {
    expect(RunProgram.__DEPS__).toStrictEqual([ArchitectureLoader]);
});

test('loads required architecture', () => {
    const request = { getArchitecture: () => architectureName };

    service.run(request);

    expect(architectureLoader.load.mock.calls[0][0]).toStrictEqual(architectureName);
});
