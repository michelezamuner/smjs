# Sloth Machine (JS)

## How to run

- `docker build -t smjs .`
- `./run.sh jarn test`
- `./run.sh jarn test Processor/Registers`
- ...


## TODO

- drop `REG_ESC` register, and use function return on stack instead (program is always a "main" function)
- add functional interface for "instruction definition", that runs the actual instruction; instruction set only returns instruction definitions given their opcode
- instructions are a proper object with opcode, first operand and second operand
- instruction set and registers are different modules, independent from the processor, which could run with different implementations of registers and different instruction sets (interfaces might be added too)
