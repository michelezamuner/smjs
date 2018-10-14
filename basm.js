const fs = require('fs');
const Assembler = require('./src/Assemblers/BASM/Assembler');

fs.readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const assembler = new Assembler();
    const bytes = assembler.assemble(data);

    const obj = /--out=(.*)/.exec(process.argv[3])[1];
    fs.writeFileSync(obj, Buffer.from(bytes.map(byte => byte.uint())), 'binary');
});
