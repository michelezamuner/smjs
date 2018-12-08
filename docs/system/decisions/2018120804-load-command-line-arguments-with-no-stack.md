# Load command line arguments with no stack


## Context

The business domain is concerned with running programs in a virtual environment; to do this the following concepts are introduced: a processor to run programs, which means to execute code from memory, an interpreter to execute the program's instructions, and a memory to store code and data. The distinction between code and data is thus necessary at the business domain level already, because the program to be run is the code part of memory, and the data to be worked with by the program is the other part of memory. What does not fit in this description is the concept of a stack, which is completely unnecessary for any of this components to work.

Now, in real processors command line arguments are stored in memory as a table of null-terminated strings of different lengths, and the number of arguments `argc` and the pointer to the table `argv` are pushed on the stack, for the program to later use. Since we don't want to add the concept of stack to the domain just for this reason, how should we handle command line arguments then? They should still be saved in a special place, that the interpreter knows about to get them back.

A solution could be to add special fields to the memory object, in addition to code and data, storing arguments count and pointer. This would make the concept of memory less clean, since it's not just code plus data anymore, but arguments handling would be very clear and explicit.

On the other hand, we could instead define a standard layout of the data segment, where for example the first two words are always `argc` and `argv`. This would leave the interface of memory clean, despite making it a bit less clear and less explicit how to deal with command line arguments.

An additional benefit of this last approach would be that it would make the programming interface of the memory component less cluttered, in particular for those clients that are not interested in using command line arguments. For example, if `InterpreterA` uses command line arguments, and `InterpreterB` doesn't, and the memory interface defined by the interpreter defines both the `data` field, and the `argc` and `argv` fields, either `InterpreterB` should be forced to know about command line arguments, despite not needing them, or we should provide two different interfaces for the memory, with and without arguments. 


## Decision

Command line arguments count `argc` and pointer `argv` will be stored as the first two words of the data segment.


## Status

Proposed


## Consequences

After storing the command line arguments in the data segment, the loader has to store as the first two words of the data segment the arguments count `argc`, and the pointer to the arguments table `argv`.

Interpreters that are interested in using the command line arguments, can find `argc` and `argv` in the first two words of the data segment.

The definition of memory remains as simple as possible, as a code segment plus a data segment.

The concept of stack doesn't creep into the domain, and it can be left to the concrete interpreters to decide if they want to internally use a stack or not; in other words, stack-less interpreters are supported too. 
