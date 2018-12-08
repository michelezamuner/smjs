# Implement Clean Architecture


## Context

This project is meant to experiment with different kinds of flexibility. In addition to the flexibility naturally supported by the idea of assemblers and compilers, that let you run programs written in any high-level, or assembly, language on the same machine, we are already allowing multiple different processor architectures to be used with the same processor, by isolating the responsibility of running the instruction pipeline independently from the responsibility of executing the instructions.


## Decision

To continue with this trend, and to standardize the project structure, now that it's getting bigger, we decided to implement the principles suggested by [clean architecture](https://github.com/michelezamuner/notes/tree/master/software-architecture/clean-architecture/clean-architecture.martin). 

The main structures that we'll add to the systems are those of *layers* and *features* (or *use cases*). While layers are pretty much fixed, and are *application*, *domain* and *adapters*, features can be any number, and represent both different functionality of the system, and plugins that can be added to it.

The basic feature is the `machine`, defining the basic elements that are needed by the system to work, namely processor, loader, memory and interpreter. However, we want to have the freedom of using different interpreters, so the `machine` plugin won't contain any concrete interpreter, which need to be added as a plugin.

Other possible plugins could be different assemblers or compilers.

At the application and adapters layer we additionally have the concepts of *ports* and *adapters*. Ports being communication purposes, we can think of `command` and `repl` as such: `command` would allow using the machine to just execute programs, while `repl` will allow to run programs from inside interactive consoles. Additional ports could be added as well. Adapters for these ports could be `command_console` and `repl_console` to provide command and interactive versions of the machine from the command line, and `web` to provide both from a Web interface.

```
application
    command
        machine
            loader_interfaces
                memory
                ...
            loader
                ...
            ...
        sma_architecture
            ...
        rasm_assembler
            ...
        basm_assembler
            ...
        php_compiler
            ...
        ...
    repl
        ..
domain
    machine
        processor_interfaces
            code
            interpreter
            ...
        processor
            ...
        interpreter_interfaces
            memory
            ...
        data_type_unit
            ...
    sma_architecture
        interpreter
            ...
        ...
    ...
adapters
    command_console
        memory
        ...
    repl_console
        ...
    web
        ...
```


## Status

Proposed


## Consequences

Modules and source files will be created according to the architectural structure described.
