const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;
const root = process.env.SM_ROOT;

beforeEach(async () => {
    await promisify(exec)(`cp -r ${root}/tests/acceptance/fixtures/mods/* ${root}/mods/`);
});

afterEach(async () => {
    await promisify(exec)(`rm -rf ${root}/mods/*`);
});

test('an error is returned if an unsupported architecture is selected', () => {
    return (async () => {
        const arc = 'unsupported';
        const file = '/tmp/file.sm';
        await promisify(fs.writeFile)(file, '', 'binary');
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm --arc=${arc} ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe(`Cannot find selected architecture "${arc}"`);
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('an error is returned if an invalid architecture is selected', () => {
    return (async () => {
        const arc = 'invalid-sma';
        const file = '/tmp/file.sm';
        await promisify(fs.writeFile)(file, '', 'binary');
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm --arc=${arc} ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe(`Selected architecture "${arc}" has invalid implementation`);
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('an error is returned if no program file is passed', () => {
    return (async () => {
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe('No program file given');
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('an error is returned if a non existent program file is passed', () => {
    return (async () => {
        const file = 'invalid';
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe(`Invalid program file given: Program file "${file}" cannot be loaded`);
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('an error is returned if an empty program file is passed', () => {
    return (async () => {
        const file = '/tmp/file.sm';
        await promisify(fs.writeFile)(file, '', 'binary');
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe(`Invalid program file given: Program file "${file}" is empty`);
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('execute sample program with stub default architecture', () => {
    return (async () => {
        const program = Buffer.from('0x01 0x00'.split(/\s+/).map(byte => parseInt(byte)));
        const file = '/tmp/file.sm';
        await promisify(fs.writeFile)(file, program, 'binary');
        const result = await promisify(exec)(`${root}/bin/sm ${file}`);
        const output = result.stdout
            .split('')
            .filter(char => char.charCodeAt(0) !== 0)
            .join('');

        expect(output).toBe('Hello, World!');
    })();
});
