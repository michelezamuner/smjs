const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
    exit: async (code, status, out = '', err = '', asm = 'basm') => {
        // tests are run in parallel, and we want to avoid them to overwrite the same file
        const file = Math.floor(Math.random() * 1000) + '.sm';
        let exp = null;

        await promisify(fs.writeFile)(file, code);

        try {
            const res = await promisify(exec)(`node main.js ${file} --asm=${asm}`);
            exp = () => {
                expect(0).toBe(status);
                expect(res.stdout.trim()).toBe(out);
            }
        } catch (e) {
            exp = () => {
                expect(e.code).toBe(status);
                expect(e.stderr.trim()).toBe(err);
            }
        }

        if (await promisify(fs.exists)(file)) {
            await promisify(fs.unlink)(file);
        }

        exp();
    },
};
