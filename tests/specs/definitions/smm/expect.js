const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;

class ExpectProgram {
    /**
     * @param {string} program
     */
    constructor(program) {
        this._bytes = program.trim().split(/\s+/).map(byte => parseInt(byte));
        this._input = null;
    }

    /**
     * @param {string} input
     */
    withInput(input) {
        this._input = input;

        return this;
    }

    /**
     * @param {number} status
     * @param {string} stdout
     * @param {string} stderr
     * @return {Promise<void>}
     */
    async toExitWith(status = 0, stdout = '', stderr = '') {
        const obj = `/tmp/${unique()}.sm`;
        let doExpect = null;

        await promisify(fs.writeFile)(obj, Buffer.from(this._bytes), 'binary');

        try {
            const result = await promisify(exec)(`echo "${this._input}" | bin/smm ${obj} >>smm.log`);
            doExpect = () => {
                expect(result.stdout.trim()).toBe(stdout);
                expect(0).toBe(status);
            };
        } catch (e) {
            doExpect = () => {
                expect(e.stderr.trim()).toBe(stderr);
                expect(e.code).toBe(status);
            };
        }

        doExpect();
    }
}

/**
 * @return {number}
 */
function unique() {
    const hrTime = process.hrtime();
    return hrTime[0] * 10000000 + hrTime[1] / 1000;
}

module.exports = {
    program: program => new ExpectProgram(program),
};
