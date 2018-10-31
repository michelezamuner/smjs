# Sloth Machine (JS)


## How to use

Build the Docker image:
```
$ docker build -t smjs .
```

Run tests:
```
$ ./run
```

which is equivalent to:
```
$ ./run yarn test
```

Compile high-level code to assembly code (still very limited!):
```
$ ./run bin/smphpc mycode.php --out=mycode.basm
```

Create executables from assembly code:
```
$ ./run bin/basm mycode.basm --out=myprogram.sm
```

Run executables in the virtual machine:
```
$ ./run bin/smm myprogram.sm
```

Or, do all these steps at once:
```
$ ./run sm mycode.php
```


## Description

The `Processor` package has only to do with the main instruction fetch/execution cycle, independently from actual processor architecture choices, like which kind of main registers to use, what's their size, how much memory can be addressed, etc. Everything needed by `Processor` to function is specified in `ProcessorInterface`, defining how it's possible to communicate with the `Processor`.

The `Processor` can thus support several processor architectures, i.e. any that respects the processor interface. Currently only one architecture has been defined, `Architectures/SMA`, standing for Sloth Machine Architecture. Ideas for possible architectures are:
- *SMA (Sloth Machine Architecture)*: using registers, fixed sized 4-bytes instructions, max 2 operands, etc.
- *SMA-ACC (Sloth Machine Architecture with ACCumulator)*: accumulator register, max 1 operand using implicit accumulator, etc.
- *SMA-STK (Sloth Machine Architecture with STacK)*: zero operands, uses stack

Once a specific architecture has been configured to be used with the processor, we can write assembly code with a specific assembly language. Of course we can have different assembly languages to be converted to the same architecture's machine code, we just need the right assembler for that. Ideas for different assemblers for the SMA architecture:
- *RASM (Reduced Assembler for Sloth Machine)*: all mnemonics point to different machine instructions, no support for variables, etc.
- *BASM: (Basic Assembler for Sloth Machine)*: menmonics can group different machine instructions, variables supported, etc.


## Architectures

### SMA

Move instruction:
| `mov eax, ebx`   | move register to register          | `mov`                        |
| `mov ax, 1`      | move immediate to register         | `movi`                       |
| `mov var, 1`     | move immediate to memory           | `movim`                      |
| `mov [ax], 1`    | move immediate to register pointer | `movipb`, `movipw`, `movipd` |
| `mov [var], 1`   | move immediate to memory pointer   | `movimp`                     |
| `mov eax, var`   | move memory to register            | `movm`                       |
| `mov eax, [bx]`  | move register pointer to register  | `movp`                       |
| `mov var, ebx`   | move register to memory            | `movrm`                      |
| `mov [ax], ebx`  | move register to register pointer  | `movrp`                      |
| `mov [var], ebx` | move register to memory pointer    | `movrmp`                     |


## References

### Architectures

- https://en.wikipedia.org/wiki/Instruction_set_architecture
- https://en.wikipedia.org/wiki/Minimal_instruction_set_computer
- https://www.tutorialspoint.com/assembly_programming/assembly_addressing_modes.htm
- https://www.tutorialspoint.com/assembly_programming/assembly_registers.htm
- http://web.stanford.edu/class/cs107/guide/x86-64.html
- https://www3.nd.edu/~dthain/courses/cse40243/fall2015/intel-intro.html
- https://www.tutorialspoint.com/assembly_programming/assembly_system_calls.htm
- http://man7.org/linux/man-pages/man2/syscalls.2.html
- http://man7.org/linux/man-pages/man2/syscall.2.html
- https://blog.packagecloud.io/eng/2016/04/05/the-definitive-guide-to-linux-system-calls/
- http://man7.org/linux/man-pages/man2/write.2.html
- https://en.wikipedia.org/wiki/File_descriptor
- https://en.wikipedia.org/wiki/Addressing_mode
- https://stackoverflow.com/questions/2782010/how-to-dynamically-allocate-memory-using-assembly-and-system-calls-under-linux
- https://www.swansontec.com/sregisters.html
- https://en.wikipedia.org/wiki/Intel_80386

### Assemblers

- http://www.keil.com/support/man/docs/armasm/armasm_dom1359731122720.htm
- http://nickdesaulniers.github.io/blog/2016/08/13/object-files-and-symbols/
- https://stackoverflow.com/questions/31227153/size-and-objdump-report-different-sizes-for-the-text-segment
- https://en.wikipedia.org/wiki/Data_segment
- https://stackoverflow.com/questions/42612724/8086-what-is-the-default-adress-of-data-segment
- https://en.wikipedia.org/wiki/.bss
- https://stackoverflow.com/questions/10168743/which-variable-size-to-use-db-dw-dd-with-x86-assembly
- https://www.linuxjournal.com/article/6463
- https://www.ibm.com/developerworks/library/l-gas-nasm/index.html
- https://en.wikipedia.org/wiki/Object_file
- http://www.tortall.net/projects/yasm/manual/html/nasm-pseudop.html
- https://www.tutorialspoint.com/assembly_programming/assembly_variables.htm

### Processor

- https://reverseengineering.stackexchange.com/questions/2006/how-are-the-segment-registers-fs-gs-cs-ss-ds-es-used-in-linux


## TODO

- Either add instructions movimpb, movimpw, movimpd (because different sizes cannot be supported from the assembler using movimp), or remove movimp altogether and let the assembler do the trick of writing in the correct place of memory (also if using RASM pointers are pretty pointless since we know all memory addresses explicitly). If going for the second, consider removing all pointer instructions from SMA, and implement them only on BASM. BASM code should not rely on defining _low variables because of these types problems.
- Memory should only have `read()` and `write()` taking address and size (default one)
- Decide how to handle negative numbers as result of subtract
- create an authoritative source of definitions within an interpreter implementation, so that all of its modules can use it instead of duplicating decisions in code
- remove interface classes, which are unnecessary, and replace them with docblocs
- add a caching instruction set that doesn't require re-loading again the same instructions from disk
