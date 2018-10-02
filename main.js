const Registers = require('./src/Interpreter/Registers');
const RegistersFactory = require('./src/Registers/RegistersFactory');
const Interpreter = require('./src/Interpreter/Interpreter');
const Memory = require('./src/Memory/Memory');
const Parser = require('./src/Interpreter/Parser');
const Processor = require('./src/Processor/Processor');
const Double = require('./src/DataTypes/Double');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const registers = new Registers(new RegistersFactory);
    const interpreter = new Interpreter(registers);
    const memory = new Memory(new Double(Double.MAX));
    const processor = new Processor(interpreter, registers, memory);
    const parser = new Parser(registers, memory);

    parser.parse(data);

    try {
        const status = processor.run();
        process.exit(status);
    } catch (e) {
        console.error(e.getMessage());
        process.exit(1);
    }
});
