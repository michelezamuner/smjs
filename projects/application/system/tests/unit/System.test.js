const System = require('../../src/System');
const DomainSystem = require('domain/sloth-machine-framework').architecture.System;

test('implements domain system', () => {
    expect(System.__proto__.name).toBe(DomainSystem.prototype.constructor.name);
});

test('provides fqcn', () => {
    expect(System.toString()).toBe('SlothMachine.System.System');
});
