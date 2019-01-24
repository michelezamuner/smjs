const OSSystem = require('../../../../src/adapters/os_system/OSSystem');
const System = require('architecture-loader').System;

/**
 * @type {null|OSSystem}
 */
let system = null;

beforeEach(() => {
    system = new OSSystem();
});

test('implements system', () => {
    expect(system).toBeInstanceOf(System);
});
