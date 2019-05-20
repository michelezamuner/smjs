const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);

/**
 * @param {string} script
 * @param {Array} args
 * @return {Promise<void>}
 */
module.exports = async function (script, args) {
    let error = '';
    try {
        const output = await exec(`bash ${script} ${args.join(' ')}`, { env: { NEWLINE: '\n' } });
        if (output.stderr) {
            error = output.stderr.trim();
        }
    } catch (e) {
        error = e.stderr;
    }
    expect(error).toBe('');
};
