const promisify = require('util').promisify;
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
    exitStatus: async (code, status) => {
        // tests are run in parallel, and we want to avoid them to overwrite the same file
        const file = Math.floor(Math.random() * 1000) + '.sm';
        let exp = null;

        await promisify(fs.writeFile)(file, code);

        try {
            await promisify(exec)(`node main.js ${file}`);
            exp = () => expect(0).toBe(status);
        } catch (e) {
            exp = () => expect(e.code).toBe(status);
        }

        if (await promisify(fs.exists)(file)) {
            await promisify(fs.unlink)(file);
        }

        exp();
    },
};
