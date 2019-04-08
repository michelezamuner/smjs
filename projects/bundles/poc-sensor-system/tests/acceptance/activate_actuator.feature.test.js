const promisify = require('util').promisify;
const exec = require('child_process').exec;

test('actuator is activated after receiving signal', async () => {
    let failed = false;
    try {
        await promisify(exec)(`bash ${__dirname}/actuator-is-activated-after-receiving-signal.sh`);
    } catch (e) {
        failed = true;
        expect(e.stderr.trim()).toBe('');
    }
    expect(failed).toBe(false);
});

test('system prints messages to STDOUT', async () => {
    let failed = false;
    try {
        await promisify(exec)(`bash ${__dirname}/system-prints-messages-to-STDOUT.sh`);
    } catch (e) {
        failed = true;
        expect(e.stderr.trim()).toBe('');
    }
    expect(failed).toBe(false);
});
