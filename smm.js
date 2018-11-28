const Interpreter = require('./src/Architectures/SMA/Interpreter');
const InstructionSet = require('./src/Architectures/SMA/InstructionSet/InstructionSet');
const Mnemonics = require('./src/Architectures/SMA/Mnemonics');
const InstructionDependencies = require('./src/Architectures/SMA/InstructionSet/InstructionDependencies');
const DefinitionLoader = require('./src/Architectures/SMA/InstructionSet/DefinitionLoader');
const Registers = require('./src/Architectures/SMA/Registers');
const Memory = require('./src/Memory/Memory');
const Stack = require('./src/Architectures/SMA/Stack');
const System = require('./src/Architectures/SMA/System');
const Processor = require('./src/Processor/Processor');
const Loader = require('./src/Processor/Loader');
const Word = require('./src/DataTypes/Word');

require('fs').readFile(process.argv[2], {encoding: 'binary'}, (err, data) => {
    const registers = new Registers(Mnemonics.register);
    const memory = new Memory(new Word(65535));
    const stack = new Stack(memory, new Word(1024));
    const system = new System();
    const dependencies = new InstructionDependencies(registers, memory, stack, system);
    const loader = new DefinitionLoader(__dirname + '/src/Architectures/SMA/InstructionDefinitions');
    const instructionSet = new InstructionSet(loader, dependencies);
    const interpreter = new Interpreter(instructionSet, Mnemonics.instruction);

    const processor = new Processor(interpreter, registers, memory);

    (new Loader(memory)).load(data);

    try {
        const status = processor.run();
        process.exit(status);
    } catch (e) {
        console.error(e.getMessage !== undefined ? e.getMessage() : e);
        process.exit(127);
    }
});
