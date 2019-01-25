# Architectures

TODO: Improve this documentation


## Local Mods

For Sloth Machine suites that support local architecture loading, architectures must be provided as source code packages, consisting in directories having the following structure:
```
my-architecture/
    src/
        ...
    tests/
        ...
    lib.js
```

These packages must be copied into the `mods/` directory of the Sloth Machine suite installation. The directory must be named after the architecture itself, so that a `my-architecture` architecture package would be selected with a command like:
```
$ sm --arc=my-architecture program-file
```

The only required file of the architecture package is `lib.js`, which must export an object (not a class!) implementing the `Architecture` interface defined in the Sloth Machine Framework domain, like the following:
```javascript
const Architecture = require('sloth-machine-framework').Architecture;

module.exports = new class extends Architecture {
    /**
     * @inheritDoc
     */
    getInterpreter(system) {
        // ...
    }
};
```

The Sloth Machine suite loading this package will make available the `sloth-machine-framework` package, for the architecture implementation to use. This is the only external package you are allowed to use from your architecture implementation, because this code will be loaded into the suite environment, whose dependencies cannot be changed.
