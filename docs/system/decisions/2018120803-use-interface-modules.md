# Use interface modules


## Context

Let's consider the `Processor` component: this depends on an `Interpreter`, because it needs it to run instructions. However, we want the processor to be independent from the concrete interpreter that might be used, so we define an `InterpreterInterface` inside the `Processor` component, and the `Interpreter` component will implement it. In this situation, `Interpreter` depends on `Processor`, and `Processor` depends on nothing:
```
Processor <- Interpreter
```

Now this situation is not really ideal either, because `Interpreter` has to know the whole `Processor` package, when the only thing it actually needs it `InterpreterInterface`. To fix this, we can extract the interface into its own package:
```
ProcessorInterfaces <- Processor
ProcessorInterfaces <- Interpreter
```

This way any change to the `Processor` package won't impact `Interpreter` (for example it won't cause recompilation of it).


## Decision

We will make use interface modules to increase the decoupling of components.


## Status

Proposed


## Consequences

Modules will be able to be easily moved to their own repositories or artifacts.
