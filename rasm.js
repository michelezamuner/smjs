const fs = require('fs');
const Assembler = require('./src/Assemblers/RASM/Assembler');

fs.readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const assembler = new Assembler();
    const bytes = assembler.assemble(data);

    const file = /--out=(.*)/.exec(process.argv[3])[1];
    fs.writeFileSync(file, Buffer.from(bytes.map(byte => parseInt(byte))), 'binary');
});
