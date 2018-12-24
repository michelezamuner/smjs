# Data unit is parameterized type


## Context

Our model of data is based on the idea that data is always a sequences of *data units*, so that any data can always be *expanded* into a list of data units. However, data units are themselves data, so that expanding them will return a list with only one element, that data unit itself.

This poses the following problem: we need to define a `Data` type, and a `DataUnit` type, where `Data` knows about `DataUnit` (because the `expand()` method must return `DataUnit[]`), and `DataUnit` knows about `Data`, because it extends it. This is of course impossible to do because it creates a circular dependency.


## Solution

What we really need is to allow the client to specify what is the concrete `Data` implementation to be used as `DataUnit`, when `Data` is defined: after this, all concrete `Data` implementation made out of it, will use the provided one as `DataUnit`. This is exactly what parameterized types are for:
```
Data<T: Data>
    ...
    expand(): T[]
```

where `T` would be the concrete type to use as `DataUnit`.


## Status

Proposed


## Consequences

This might be problematic to implement in programming languages that don't support generics natively. However, this is an idea of how it could work in Java (compiles):
```java
import java.util.List;
import java.util.Collections;

public class Main {
    public static void main(final String[] args) {
        final Data value = new Byte(2);
        final List<Byte> bytes = value.expand();
        for (final Byte b: bytes) {
            System.out.println(b);
        }
    }
}

class Data<Unit extends Data> {
    private final int value;
    public Data(final int value) {
        this.value = value;
    }
    
    @Override
    public String toString() {
        return Integer.toString(value);
    }
    
    public List<Unit> expand() {
        return Collections.singletonList((Unit)this);
    }
}

class Byte extends Data<Byte> {
    public Byte(final int value) {
        super(value);
    }
}
```
