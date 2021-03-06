const promisify = require('util').promisify;
const exec = require('child_process').exec;
const root = process.env.SM_ROOT;

test('a fatal error in the architecture is caught and a user friendly error is displayed', () => {
    return (async () => {
        const arc = 'bugged';
        const file = '/tmp/file.sm';
        let hasThrown = false;
        try {
            await promisify(exec)(`${root}/bin/sm --arc=${arc} ${file}`);
        } catch (e) {
            hasThrown = true;
            expect(e.stderr.trim()).toBe('A fatal error happened in the application');
            expect(e.code).toBe(127);
        }

        expect(hasThrown).toBe(true);
    })();
});
