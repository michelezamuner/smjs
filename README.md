# Sloth Machine (JS)

The `Processor` package has only to do with the main instruction fetch/execution cycle, independently from actual processor architecture choices, like which kind of main registers to use, what's their size, how much memory can be addressed, etc. Everything needed by `Processor` to function is specified in `ProcessorProtocol`, defining how it's possible to communicate with the `Processor`.

The `Processor` can thus support several processor architectures, i.e. any that respects the processor protocol. Currently only one architecture has been defined, `ProcessorArchitectures/SMA`, standing for Sloth Machine Architecture. Ideas for possible architectures are:
- *SMA (Sloth Machine Architecture)*: using registers, fixed sized 4-bytes instructions, max 2 operands, etc.
- *SMA-ACC (Sloth Machine Architecture with ACCumulator)*: accumulator register, max 1 operand using implicit accumulator, etc.
- *SMA-STK (Sloth Machine Architecture with STacK)*: zero operands, uses stack

Once a specific architecture has been configured to be used with the processor, we can write assembly code with a specific assembly language. Of course we can have different assembly languages to be converted to the same architecture's machine code, we just need the right assembler for that. Ideas for different assemblers for the SMA architecture:
- *RASM (Raw Assembler for Sloth Machine)*: all mnemonics point to different machine instructions, no support for variables, etc.
- *BASM: (Basic Assembler for Sloth Machine)*: menmonics can group different machine instructions, variables supported, etc.


## Architectures

### SMA

Instructions:
- `mov reg reg` copy value from right register to left register
- `movi reg imm` copy right immediate value to left register
- `movmb reg mem` copy byte found at right memory address to left register
- `movmw reg mem` copy word found at right memory address to left register
- `movmrb mem reg` copy value from right register to left memory address


## How to run

- `docker build -t smjs .`
- `./run.sh jarn test`
- `./run.sh jarn test Processor/Registers`
- ...


## TODO

- extended registers can be used to take only one byte of the usual word that is contained in registers, for example if I store a word in eax, I can get the least significant byte referring to ax
- create an authoritative source of definitions within an interpreter implementation, so that all of its modules can use it instead of duplicating decisions in code
