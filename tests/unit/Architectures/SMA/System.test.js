const System = require('../../../../src/Architectures/SMA/System');

/**
 * @type {null|System}
 */
let system = null;

beforeEach(() => {
    system = new System();
});

test('implements read', () => {
    expect(system.read).toBeDefined();
});

test('implements write', () => {
    expect(system.write).toBeDefined();
});
