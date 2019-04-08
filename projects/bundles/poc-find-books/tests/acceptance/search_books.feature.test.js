const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);

test('find books containing search text with console command', async () => {
    const parameters = [
        { search: 'dog', expected: "12" },
        { search: 'ball', expected: "31" },
    ];
    for (const { search, expected } of parameters) {
        const script = `find-books-containing-search-text-with-console-command.sh "${search}" "${expected}"`;
        await assertScript(script);
    }
});

test.skip('find books containing search text with finder service', async () => {
    // start integration bus
    // use find books service
});

/**
 * @param {string} script
 * @return {Promise<void>}
 */
async function assertScript(script) {
    let error = '';
    try {
        const output = await exec(`bash ${__dirname}/${script}`);
        if (output.stderr) {
            error = output.stderr.trim();
        }
    } catch (e) {
        error = e.stderr;
    }
    expect(error).toBe('');
}
