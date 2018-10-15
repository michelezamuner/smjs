const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;

class ExpectProgram {
    /**
     * @param {string} program
     */
    constructor(program) {
        this._program = program;
    }

    /**
     * @param {number} status
     * @param {string} stdout
     * @param {string} stderr
     * @return {Promise<void>}
     */
    async toExitWith(status = 0, stdout = '', stderr = '') {
        const fileName = unique();
        const php = `/tmp/${fileName}.php`;
        const asm = `/tmp/${fileName}.basm`;
        const obj = `/tmp/${fileName}.sm`;
        let doExpect = null;

        await promisify(fs.writeFile)(php, this._program);
        await promisify(exec)(`bin/smphpc ${php} --out=${asm}`);
        await promisify(exec)(`bin/basm ${asm} --out=${obj}`);

        try {
            const result = await promisify(exec)(`bin/smm ${obj}`);
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
