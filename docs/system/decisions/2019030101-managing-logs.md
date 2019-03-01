# Managing logs


## Context

Every application needs to manage logs, of different levels, and sending them to different channels.


## Decision

We want to use the normal approach regarding managing logs, according to which any logging concern should be confined to the adapter layer, leaving the application layer independent from them. However, since logs contents are also produced in the application layer, we need a way to communicate them to the logger. The usual solution is to add a message bus to the use case services, so that any information that is relevant to be communicated to the outside world, from an application logic point of view, can be sent as a message, so that some adapter is then able to catch these messages, and maybe send them to the logger.

For example, logs are the only way we have to display debug stack traces. In fact, we already have in place a mechanism to display errors to the end users, which is a specific use case for it: however, this use case is, as just stated, focused to communicate with the end user, and for this reason it should be user friendly. This means that application errors will be specific messages informing the user for example of an input validation error, while system errors will likely be just generic messages without any technical detail, which wouldn't be interesting for the end user. Both kinds of errors, then, won't contain any stack trace, when displayed to the end user, and thus we cannot use errors displayed to the user interface as a debug mechanism.

What is left for debugging, then, are logs. In particular, we can program the error handler application interactor to send messages containing the stack trace, in addition to displaying the generic error message. These error messages will then be caught by the logger, which will decide what to do with these messages according to the current application runtime mode or environment: for example in a development setup errors can be logged to the STDERR (in addition to a file maybe), while in a demo or production setup errors will only be logged to files.


## Status

Proposed


## Consequences

The application layers stays independent from any logging concerns, while it just sends meaningful application messages, that can be used by adapters, or even other use cases, for any reason, for example logging.

Stack traces are not displayed to the main error output, but as error logs, which in development mode can be redirected to the standard error, if this turns out to be handy. The main error output should only display user friendly messages.
