const fs = require('fs');
const Compiler = require('./src/Compilers/PHP/Compiler');

fs.readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const compiler = new Compiler();
    const asm = compiler.compile(data);

    const file = /--out=(.*)/.exec(process.argv[3])[1];
    fs.writeFileSync(file, asm);
});
