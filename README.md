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

Move instruction:
| `mov eax, ebx`   | move register to register          | `mov`    |
| `mov eax, 1`     | move immediate to register         | `movi`   |
| `mov var, 1`     | move immediate to memory           | `movim`  |
| `mov [eax], 1`   | move immediate to register pointer | `movip`  |
| `mov [var], 1`   | move immediate to memory pointer   | `movipm` |
| `mov eax, var`   | move memory to register            | `movm`   |
| `mov eax, [ebx]` | move register pointer to register  | `movp`   |
| `mov eax, [var]` | move memory pointer to register    | `movpm`  |
| `mov var, ebx`   | move register to memory            | `movrm`  |
| `mov [eax], ebx` | move register to register pointer  | `movrp`  |


## How to run

- `docker build -t smjs .`
- `./run.sh jarn test`
- `./run.sh jarn test Processor/Registers`
- ...


## TODO

- ES cannot represent numbers too big, and at a certain point the 2's complement kicks in, so when we manipulate bits we get negative numbers while we want to always store positive numbers instead. Define a number type to store and manipulate numbers in a reliable way.
- Decide how to handle negative numbers as result of subtract
- create an authoritative source of definitions within an interpreter implementation, so that all of its modules can use it instead of duplicating decisions in code
