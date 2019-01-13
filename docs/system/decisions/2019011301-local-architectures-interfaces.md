# Local architecture interfaces

## Context

Sloth machine applications need to support any type of processor architectures, that can be loaded and chosen by users when running the applications. The architecture with which to run the virtual machine will be selected at launch time: for example, a command-line application could be used like:
```
$ sm --arc=sma program_file
```

To avoid limiting the number of architectures that are available to the ones shipped with the application, and to avoid having to rebuild and redistribute the application just to add support to a single architecture, since all the rest of the application should remain unchanged, we support adding new architectures as mods, or user-side plugins, that are provided by the user without needing to rebuild the application. For example, new architectures could be provided by copying an architecture directory into a specific directory where the application is configured to go looking for architecture implementations.


## Decision

The local architecture loader, which is selected by an adapter to load architectures from local files, will load an architecture factory object from the module file. This factory will have a `create` method, taking the program loader implementation (that needs to be injected into the architecture), that will produce an instance of the architecture object.


## Status

Proposed


## Consequences

It's well defined how local architecture mods need to interface to the local architecture loader.

New architecture modules can be easily added to an already built application by just providing a module respecting this interface in the proper directory.
