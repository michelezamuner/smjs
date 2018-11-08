const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = class ExpectProgram {
    /**
     * @param {string} language
     * @return {ExpectProgram}
     */
    static for(language) {
        return new ExpectProgram(language);
    }

    /**
     * @param {string} language
     */
    constructor(language) {
        this._program = null;
        this._input = null;
        this._ext = language;
        this._binary = false;
    }

    /**
     * @return {ExpectProgram}
     */
    binary() {
        this._binary = true;

        return this;
    }

    /**
     * @param {string} program
     * @return {ExpectProgram}
     */
    program(program) {
        this._program = program;
        if (this._binary) {
            this._program = Buffer.from(this._program.trim().split(/\s+/).map(byte => parseInt(byte)));
        }

        return this;
    }

    /**
     * @param {string} input
     * @return {ExpectProgram}
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
        const file = `/tmp/${this._unique()}.${this._ext}`;
        let doExpect = null;

        await promisify(fs.writeFile)(file, this._program, this._binary ? 'binary' : 'utf8');

        try {
            const result = await promisify(exec)(`echo "${this._input}" | bin/sm ${file}`);
            doExpect = () => {
                const output = result.stdout
                    .split('')
                    .filter(char => char.charCodeAt(0) !== 0)
                    .join('');
                expect(output).toBe(stdout);
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

    /**
     * @return {number}
     * @private
     */
    _unique() {
        const hrTime = process.hrtime();

        return Math.floor(hrTime[0] * 10000000 + hrTime[1] / 1000);
    }
};
