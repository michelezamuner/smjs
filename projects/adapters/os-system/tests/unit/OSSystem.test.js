const OSSystem = require('../../src/OSSystem');
const System = require('app/system').System;
const Filesystem = require('../../src/Filesystem');
const NativeFileSystem = require('../../src/NativeFilesystem');
const Integer = require('domain/sloth-machine-framework').data.Integer;
const Data = require('domain/sloth-machine-framework').data.Data;
const DataUnit = require('domain/sloth-machine-framework').data.DataUnit;
const Size = require('domain/sloth-machine-framework').data.Size;

/**
 * @type {Object|Filesystem}
 */
const filesystem = {};

/**
 * @type {null|OSSystem}
 */
let system = null;

beforeEach(() => {
    system = new OSSystem(filesystem);
});

test('implements system', () => {
    expect(system).toBeInstanceOf(System);
});

test('can be injected', () => {
    expect(OSSystem.__DEPS__).toStrictEqual([Filesystem]);
});

test('provides fqcn', () => {
    expect(Filesystem.toString()).toBe('SlothMachine.OSSystem.Filesystem');
    expect(OSSystem.toString()).toBe('SlothMachine.OSSystem.OSSystem');
    expect(NativeFileSystem.toString()).toBe('SlothMachine.OSSystem.NativeFilesystem');
});

test('implements write', () => {
    const file = 1;
    const data = ['a', 'b', 'c', 'd'].map(value => value.charCodeAt(0));
    const toWrite = 4;

    filesystem.write = (fd, buf, count) => {
        if (fd === file && Buffer.compare(buf, new Buffer(data)) === 0 && count === toWrite) {
            return new Size(toWrite);
        }

        return null;
    };

    const mapped = data.map(value => new DataUnit(value));
    const written = system.write(new Integer(file), new Data(mapped), new Size(toWrite));

    expect(written).toStrictEqual(new Size(toWrite));
});
