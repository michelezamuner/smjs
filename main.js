const Registers = require('./src/Architectures/SMA/Registers');
const Interpreter = require('./src/Architectures/SMA/Interpreter');
const Assembler = require('./src/Assemblers/BASM/Assembler');
const Memory = require('./src/Memory/Memory');
const Loader = require('./src/Processor/Loader');
const Processor = require('./src/Processor/Processor');
const MissingExitException = require('./src/Processor/MissingExitException');
const Word = require('./src/DataTypes/Word');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const memory = new Memory(new Word(Word.MAX));
    const assembler = new Assembler();
    const loader = new Loader(memory);
    const registers = new Registers();
    const interpreter = new Interpreter(registers, memory);
    const processor = new Processor(interpreter, registers, memory);

    const bytes = assembler.assemble(data);
    loader.load(bytes);

    try {
        const status = processor.run();
        process.exit(status);
    } catch (e) {
        console.error(e instanceof MissingExitException ? e.getMessage() : e);
        process.exit(1);
    }
});
