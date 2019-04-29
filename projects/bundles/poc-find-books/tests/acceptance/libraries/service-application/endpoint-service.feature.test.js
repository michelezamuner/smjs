const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);

test('get a static message from an endpoint', async () => {
    const script = `get-a-static-message-from-an-endpoint.sh "message" "/message" "response message"`;
    await assertScript(script);
});

/**
 * @param {string} script
 * @return {Promise<void>}
 */
async function assertScript(script) {
    let error = '';
    try {
        const output = await exec(`bash ${__dirname}/scripts/${script}`);
        if (output.stderr) {
            error = output.stderr.trim();
        }
    } catch (e) {
        error = e.stderr;
    }
    expect(error).toBe('');
}
