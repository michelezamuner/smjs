# Local architecture interfaces


## Context

Sloth machine applications need to support any type of processor architectures, that can be loaded and chosen by users when running the applications. The architecture with which to run the virtual machine will be selected at launch time: for example, a command-line application could be used like:
```
$ sm --arc=sma program_file
```

To avoid limiting the number of architectures that are available to the ones shipped with the application, and to avoid having to rebuild and redistribute the application just to add support to a single architecture, since all the rest of the application should remain unchanged, we support adding new architectures as mods, or user-side plugins, that are provided by the user without needing to rebuild the application. For example, new architectures could be provided by copying an architecture directory into a specific directory where the application is configured to go looking for architecture implementations.


## Decision

The local architecture loader, which is selected by an adapter to load architectures from local files, will load an architecture object from the module file.

This architecture will implement the `<Architecture>` domain interface, thus providing a `getInterpreter(<System>)` method, taking a System to return an Interpreter for that specific architecture.

The module file must be named `lib`, and must be located directly inside a directory called with the name of the architecture.

The architecture module is only allowed to depend on the `smf`, and no other external packages, because the environment where the architecture module is loaded is controlled by the suite loading it, for example the Sloth Machine virtual machine.


## Status

Proposed


## Consequences

New architecture modules can be easily added to an already built application by just providing in the proper directory a module respecting this interface.
