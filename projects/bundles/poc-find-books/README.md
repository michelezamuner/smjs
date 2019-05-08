# POC find books

## Application

- find books (primary port)
    - search books(text)
        - validation error (text too short/invalid characters): Error
        - search error: Error
        - book found: FoundBook (called asynchronously once per book found)
        - search complete: SearchComplete
    - suggest book (book, recipients)
        - validation error (invalid book, invalid targets): Error
        - suggest error: Error
        - send suggestion: Success
- books source (secondary port)
- book search (secondary port)
- suggestions sender (secondary port)


## Adapters

### Clients
- search cli (search books)
- suggest cli (suggest book)
- find books service (search books, suggest books)

### Drivers
- local books source (books source)
- online books source (books source)
- basic book search (book search)
- email sender (suggestions sender)
- message sender (suggestions sender)

