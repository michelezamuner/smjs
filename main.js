const Registers = require('./src/Interpreter/Registers');
const RegistersFactory = require('./src/Registers/RegistersFactory');
const Interpreter = require('./src/Interpreter/Interpreter');
const Memory = require('./src/Memory/Memory');
const Parser = require('./src/Interpreter/Parser');
const Processor = require('./src/Processor/Processor');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const registers = new Registers(new RegistersFactory);
    const interpreter = new Interpreter(registers);
    const memory = new Memory(32);
    const processor = new Processor(interpreter, registers, memory);
    const parser = new Parser(registers, memory);

    parser.parse(data);
    const status = processor.run();

    process.exit(status);
});
