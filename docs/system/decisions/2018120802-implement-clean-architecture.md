# Implement Clean Architecture


## Context

This project is meant to be a playground to experiment with different technologies and design solutions.


## Decision

To standardize the project structure, now that it's getting bigger, we will implement the principles suggested by [clean architecture](https://github.com/michelezamuner/notes/tree/master/software-architecture/clean-architecture/clean-architecture.martin), enhanced by concepts from Domain Driven Design, and plugin architectures. 

### Domain
The core domain is the "virtual machine framework", which only defines how programs should be executed, but doesn't specify what actual instructions or data types are supported.

A Program is a sequence of Data Units. Data Units are a kind of Data with the smallest possible size. Data supports several operations, like arithmetic, comparison, etc., and in particular an "expand" operation to return an equivalent set of Data Units.

A Program is run by a Processor, which uses an Interpreter to first define which sets of Data Units should be regarded as Instructions, and then to execute these Instructions. When running an Instruction, the Interpreter returns a Context object knowing if the execution should jump, or be terminated. The execution of a Program by a Processor always returns an Exit Status, which is architecture-dependent. The termination of a Program must always be requested explicit, via a dedicated instruction, otherwise an error is raised.

Additional domains are defined for each architecture, so that a virtual machine can support many different architectures. Each architecture defines a concrete set of data types, and a concrete Interpreter.

Assemblers and compilers also define their own domains.

The following domains could thus be defined:
- `smf`: the core virtual machine framework domain
- `sma`: definitions for the SMA architecture domain
- `basm`: definitions for the BASM assembler domain
- `php`: definitions for the PHP compiler domain

### Application
The application layer may define the following ports and use cases:
- the `vm` port allows to execute programs, according to the configured architecture
- the `repl` port allows to execute programs interactively, and uses the functionality of `vm`
- the `dbg` port allows to execute programs step by step for debugging, and uses the functionality of `vm`
- the `asm` port allows to run an assembler on some assembly code to produce executable object code
- the `cmp` port allows to run a compiler on some high level language to produce assembly code

### Adapters
The following adapters may be defined:
- the `cli` adapter allows to use the virtual machine functionality from the command line
- the `web` adapter allows to use the virtual machine functionality from a Web page

### Plugin architecture
We want to support building different types of applications by composing together sets of different available plugins. For example:

**sloth machine (CLI)**

    AD_sm + AP_vm + D_smf + D_sma (or others)
    
**sloth machine compiler (CLI)**

    AD_sm_cmp + AP_vm + AP_cmp + AP_asm + D_smf + D_sma (or others) + D_basm (or others) + D_php (or others)

**sloth machine REPL (CLI)**

    AD_sm_repl + AP_repl + D_smf + D_sma (or others) + D_basm (or others) + D_php (or others)

**sloth machine debugger (CLI)**

    AD_sm_dbg + AP_dbg + D_smf + D_sma (or others) + D_basm (or others) + D_php (or others)

**sloth machine dev (CLI)**

    AD_sm_dev + AP_vm + AP_cmp + AP_asm + AP_repl + AP_dbg + D_smf + D_sma (or others) + D_basm (or others) + D_php (or others)
    
**sloth machine Web (Web)**

    AD_sm_dev + AP_vm + AP_cmp + AP_asm + AP_repl + AP_dbg + D_smf + D_sma (or others) + D_basm (or others) + D_php (or others)


### Example modules
```
domain
    smf
        data
            <GenericData<T: GenericData>>
                eq(<GenericData<T>>): bool
                inc(): <GenericData<T>>
                add(<GenericData<T>>): <GenericData<T>>
                expand(): T[]
                ...
            <Unit>: <GenericData<<Unit>>>
            <Data>: <GenericData<<Unit>>>
            <Size>: <Data>
        program [data]
            <Address>: data.<Data>
            <Opcode>: data.<Unit>[]
            <Operands>: data.<Unit>[]
            Instruction
                Instruction(data.<Unit>[] address, data.<Unit>[] opcode, data.<Unit>[] operands)
                getAddress(): <Address>
                getOpcode(): <Opcode>
                getOperands(): <Operands>
            Program
                Program(data.<Unit>[] program, data.<Data> startingAddress)
                getStartingAddress(): <Address>
                read(Address, data.<Size>): data.<Unit>[]
        interpreter [data, program]
            <Loader>
                load(String): Program
            <ExitStatus>: data.<Data>
            Context
                shouldJump(): bool
                getJumpAddress(): program.<Address>
                shouldExit(): bool
                getExitStatus(): <ExitStatus>
            <Interpreter>
                getDefaultExitStatus(): <ExitStatus>
                getOpcodeSize(): data.<Size>
                getOperandsSize(program.<Opcode>): data.<Size>
                exec(program.Instruction): Context
        processor [program, interpreter, data]
            Processor
                Processor(interpreter.<Interpreter>)
                run(program.Program): interpreter.<ExitStatus>
    sma [smf]
        loader
            Loader
                load(String): smf.program.Program
        data [smf.data]
            Byte: smf.data.<Unit>
            Word: smf.data.<Data>
            Double: smf.data.<Data>
            Size: smf.data.<Size>
        program
            Address: smf.program.<Address>
        system
            <System>
                read(...): ...
                write(...): ...
        interpreter [smf.interpreter]
            ExitStatus: smf.interpreter.<ExitStatus>
            Interpreter: smf.interpreter.<Interpreter>
                Interpreter(<System>)
                ...
        instructions
            ...
application
    loader [domain.smf.program]
        <Loader>
            load(): domain.smf.program.Program
    system [domain.sma.system]
        <System>: domain.sma.system.<System>
            read(...): ...
            write(...): ...
    vm
        run_program [application.loader, domain.smf.program, domain.smf.processor, domain.smf.interpreter]
            <Request>
            Response
                getExitStatus(): domain.smf.interpreter.<ExitStatus>
            <Presenter>
                present(Response)
            RunProgram
                RunProgram(application.loader.<Loader>, domain.smf.processor.Processor, <Presenter>)
                exec(<Request>)
adapters
    cli
        file_loader [application.loader, domain.smf.program, domain.smf.interpreter]
            Loader: application.loader.<Loader>
                Loader(domain.smf.interpreter.<Loader>, File)
                load(): domain.smf.program.Program
        inline_loader [application.loader, domain.smf.program, domain.smf.interpreter]
            Loader: application.loader.<Loader>
                Loader(domain.smf.interpreter.<Loader>, string)
                load(): domain.smf.program.Program
        system [application.system]
            System: application.system.<System>
                read(...): ...
                write(...): ...
        vm
            run_program [application.vm.run_program, domain.smf.interpreter]
                Controller
                    Controller(application.vm.run_program.RunProgram)
                    runProgram(application.vm.run_program.<Request>)
                Request: application.vm.run_program.<Request>
                    getProgram(): string
                ViewModel
                    ViewModel(domain.smf.interpreter.<ExitStatus>)
                    getExitStatus(): int
                <View>
                    render(ViewModel)
                Presenter: application.vm.run_program.<Presenter>
                    Presenter(<View>)
                    present(application.vm.run_program.Response)
        app
            App
                run()
            providers [...]
                AppProvider
                    register(Container)
                ...
            views [adapters.cli.vm.run_program]
                ExitStatus: adapters.cli.vm.run_program.<View>
                render(adapters.cli.vm.run_program.ViewModel)
                getExitStatus(): int
```

### Examples of main implementations
```
module domain.smf.processor

import domain.smf.program.Program
import domain.smf.program.Instruction
import domain.smf.interpreter.<Interpreter>
import domain.smf.interpreter.<ExitStatus>

class Processor
    Processor(<Interpreter> interpreter)
        this.interpreter = interpreter
        
    run(Program program): <ExitStatus>
        opcodeSize = interpreter.getOpcodeSize()
        exitStatus = interpreter.getDefaultExitStatus()
        address = program.getStartingAddress()
        
        while (true)
            // @todo: handle missing exit
            
            opcode = program.read(address, opcodeSize)
            operandsSize = interpreter.getOperandsSize(opcode)
            operandsAddress = address.add(opcodeSize)
            operands = program.read(operandsAddress, operandSize)
            instruction = Instruction(address, opcode, operands)
            
            context = interpreter.exec(instruction)
            if (context.shouldExit())
                exitStatus = context.getExitStatus()
                break
            address = context.shouldJump() ? context.getJumpAddress() : operandsAddress.add(operandsSize)
            
        return exitStatus
```
```
module domain.sma.loader

import domain.smf.interpreter.<Loader>
import domain.smf.program.Program
import domain.smf.program.Address
import domain.sma.data.Byte

class Loader: <Loader>
    Loader(string data)
        this.data = data
    load(): Program
        bytes = data.split('').map(char -> new Byte(char.encode()))
        return new Program(bytes, new Address(0))
```
```
module domain.sma.interpreter

import domain.smf.interpreter.<Interpreter>
import domain.smf.interpreter.<ExitStatus>
import domain.smf.interpreter.Context
import domain.smf.data.<Size>
import domain.smf.program.<Opcode>
import domain.smf.program.Instruction
import domain.sma.system.<System>
import domain.sma.interpreter.ExitStatus
import domain.sma.data.Size

class Interpreter: <Interpreter>
    Interpreter(InstructionSet instructionSet, <System> system, ContextBuilder contextBuilder)
        this.instructionSet = instructionSet
        this.system = system
        this.contextBuilder = contextBuilder
        
    getDefaultExitStatus(): <ExitStatus>
        return new ExitStatus(0);
        
    getOpcodeSize(): <Size>
        return new Size(1);
        
    getOperandsSize(<Opcode> opcode): <Size>
        return instructionSet.getInstructionDefinition(opcode).getOperandsSize()
        
    exec(Instruction instruction): Context
        definition = instructionSet.getInstructionDefinition(instruction.getOpcode())
        result = definition.exec(instruction.getOperands())
        
        if (result instanceof JumpResult)
            contextBuilder.setShouldJump()
            contextBuilder.setJumpAddress(result.getJumpAddress())
            
        if (result instanceof ExitResult)
            contextBuilder.setShouldExit()
            contextBuilder.setExitStatus(result.getExitStatus())

        return contextBuilder.buildContext()
```
```
module application.vm.run_program

import domain.smf.processor.Processor
import application.loader.<Loader>
import application.vm.run_program.<Presenter>
import application.vm.run_program.<Request>
import application.vm.run_program.Response

class RunProgram
    RunProgram(<Loader> loader, Processor processor, <Presenter> presenter)
        this.loader = loader
        this.processor = processor
        this.presenter = presenter

    exec(Request request)
        // here request is not carrying any data, so it could be removed, but we leave it here
        // to show where it would be according to the architecture

        program = loader.load()
        exitStatus = processor.run(program)
        presenter.present(new Response(exitStatus))
```
```
module adapters.cli.file_loader

import domain.smf.program.Program
import domain.smf.interpreter.<Loader> as <ILoader>
import application.vm.loader.<Loader>

class Loader: <Loader>
    Loader(<ILoader> loader, File file)
        this.loader = loader
        this.file = file
    
    load(): Program
        data = file.getContents()
        return this.loader.load(data)
```
```
module adapters.cli.inline_loader

import domain.smf.program.Program
import domain.smf.interpreter.<Loader> as <ILoader>
import application.vm.loader.<Loader>

class Loader: <Loader>
    Loader(<ILoader> loader, String data)
        this.loader = loader
        this.data = data
        
    load(): Program
        return this.loader.load(data)
```
```
module adapters.cli.vm.run_program

import application.vm.run_program.RunProgram
import application.vm.run_program.<Request>

class Controller
    Controller(RunProgram service)
        this.service = service

    runProgram(<Request> request)
        service.run(request)
```
```
module adapters.cli.vm.run_program

import adapters.cli.vm.run_program.<View>
import application.vm.run_program.Response

class Presenter
    Presenter(<View> view)
        this.view = view
        
    present(Response response)
        viewModel = new ViewModel(response.getExitStatus())
        view.render(viewModel)
```
```
module adapters.cli.app

import adapters.cli.file_loader.Loader as FileLoader
// or
import adapters.cli.inline_loader.Loader as InlineLoader

import adapters.cli.system.System
import adapters.cli.app.views,ExitStatus
import adapters.cli.vm.run_program.Presenter
import adapters.cli.vm.run_program.Controller
import adapters.cli.vm.run_program.Request
import domain.sma.interpreter.Interpreter
import domain.sma.loader.Loader
import domain.smf.processor.Processor
import application.vm.run_program.RunProgram

class App
    run()
        file = new File(getArgument("file"))
        loader = FileLoader(new Loader(), file)
        // or
        program = getArgument("program")
        loader = new InlineLoader(new Loader(), program)

        // the following could be automatically created by the container
        
        system = new System()
        interpreter = new Interpreter(system)
        processor = new Processor(interpreter)
        view = new ExitStatus()
        presenter = new Presenter(view)

        service = new RunProgram(loader, processor, presenter)
        controller = new Controller(service)
        request = new Request()
        
        controller.run(request)
        exit(view.render())
```


## Status

Proposed


## Consequences

Modules and source files will be created according to the architectural structure described.
