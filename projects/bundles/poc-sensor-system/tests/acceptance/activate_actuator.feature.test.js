const promisify = require('util').promisify;
const fs = require('fs');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const root = process.env.SM_ROOT;

test.skip('actuator is activated after receiving signal', () => {
    return (async () => {
        const config = require(root + '/config/config.js');
        const signalValue = 'signal';
        const actuatorOutputFile = config.actuator.output_file;

        if (await exists(actuatorOutputFile)) {
            await promisify(fs.unlink)(actuatorOutputFile);
        }

        const system = spawn(`${root}/bin/start-system`, {stdio: 'ignore', detached: true});
        await promisify(exec)(`${root}/bin/send-signal ${signalValue}`);
        system.kill('SIGINT');

        expect(await exists(actuatorOutputFile)).toBe(true);
        expect(await promisify(fs.readFile)(actuatorOutputFile, {encoding: 'utf8'})).toBe(signalValue);
    })();
});

/**
 * @param {string} file
 * @return {Promise<boolean>}
 */
async function exists(file) {
    try {
        await promisify(fs.stat)(file);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        }

        throw e;
    }

    return true;
}
