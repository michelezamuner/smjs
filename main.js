const RegistersFactory = require('./src/Registers/RegistersFactory');
const Registers = require('./src/ProcessorArchitectures/SMA/Registers');
const Interpreter = require('./src/ProcessorArchitectures/SMA/Interpreter');
const Assembler = require('./src/Assemblers/BASM/Assembler');
const Memory = require('./src/Memory/Memory');
const Loader = require('./src/Processor/Loader');
const Processor = require('./src/Processor/Processor');
const Double = require('./src/DataTypes/Double');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const registers = new Registers(new RegistersFactory);
    const interpreter = new Interpreter(registers);
    const memory = new Memory(new Double(Double.MAX));
    const assembler = new Assembler(registers);
    const loader = new Loader(memory);
    const processor = new Processor(interpreter, registers, memory);

    const bytes = assembler.assemble(data);
    loader.load(bytes);

    try {
        const status = processor.run();
        process.exit(status);
    } catch (e) {
        console.error(e.getMessage());
        process.exit(1);
    }
});
