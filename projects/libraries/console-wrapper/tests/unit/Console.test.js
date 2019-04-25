const Console = require('../../src/Console');
const NativeConsole = require('../../src/NativeConsole');

test('provides fqcn', () => {
    expect(Console.toString()).toBe('ConsoleWrapper.Console');
    expect(NativeConsole.toString()).toBe('ConsoleWrapper.NativeConsole');
});
