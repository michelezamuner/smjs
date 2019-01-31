const Architecture = require('sloth-machine-framework').Architecture;
const Size = require('sloth-machine-framework').Size;
const Status = require('sloth-machine-framework').Status;
const Opcode = require('sloth-machine-framework').Opcode;
const DataUnit = require('sloth-machine-framework').DataUnit;
const Data = require('sloth-machine-framework').Data;
const Integer = require('sloth-machine-framework').Integer;
const ExitStatus = require('sloth-machine-framework').ExitStatus;

module.exports = new class extends Architecture {
    /**
     * @inheritDoc
     */
    getInterpreter(system) {
        return {
            getOpcodeSize: () => new Size(1),
            getOperandsSize: () => new Size(0),
            exec: instruction => {
                switch (true) {
                    case instruction.getOpcode().eq(new Opcode([new DataUnit(0x00)])):
                        return new Status(null, new ExitStatus(0));
                    case instruction.getOpcode().eq(new Opcode([new DataUnit(0x01)])):
                        const data = new Data([
                            new DataUnit('H'.charCodeAt(0)),
                            new DataUnit('e'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('o'.charCodeAt(0)),
                            new DataUnit(','.charCodeAt(0)),
                            new DataUnit(' '.charCodeAt(0)),
                            new DataUnit('W'.charCodeAt(0)),
                            new DataUnit('o'.charCodeAt(0)),
                            new DataUnit('r'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('d'.charCodeAt(0)),
                            new DataUnit('!'.charCodeAt(0)),
                        ]);
                        system.write(new Integer(1), data, new Size(13));

                        return new Status();
                }
            },
        };
    }
};
