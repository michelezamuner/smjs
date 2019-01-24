const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;
const bin = process.env.SM_BIN;

test('an error is returned if an unsupported architecture is selected', () => {
    return (async () => {
        const arc = 'unsupported';
        const file = `/tmp/file.sm`;
        await promisify(fs.writeFile)(file, '', 'binary');
        let hasThrown = false;
        try {
            await promisify(exec)(`${bin} --arc=${arc} ${file}`);
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
        const file = `/tmp/file.sm`;
        await promisify(fs.writeFile)(file, '', 'binary');
        let hasThrown = false;
        try {
            await promisify(exec)(`${bin} --arc=${arc} ${file}`);
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
            await promisify(exec)(`${bin}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe('No program file given');
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test('an error is returned if an invalid program file is passed', () => {
    return (async () => {
        const file = 'invalid';
        let hasThrown = false;
        try {
            await promisify(exec)(`${bin} ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe(`Invalid program file given: "${file}"`);
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});

test.skip('execute sample program with default architecture SMA', () => {
    // @todo: implement this
});

test.skip('execute sample program with alternative architecture', () => {
    // @todo: implement this
});