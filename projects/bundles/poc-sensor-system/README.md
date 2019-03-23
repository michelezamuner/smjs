# Sensor system

This is a proof of concept aimed at showcasing the importance of leaving the controller of a primary adapter oblivious of any presentational responsibility, as a general principle.

This application simulates a system comprised of a service that is able to receive signals from a sensor, and activate an actuator in response of that signal. Of course in our simulation both the sensor and the signal won't be real-life systems, but rather some computer action.

The sensor is thought to be a system with no text output device whatsoever, like a button or a switch, or a photocell, that can just produce a signal at random moments in time, but that is capable of displaying no output at all. In our case, we simulate this with a single script that can send a string message to a TCP port, opened by the service, and exit immediately.

The actuator is thought to be a system with no text output, too, like a light bulb, a mechanical arm, an electronic device that is turned on, etc. We simulate this by writing the original signal to a specific file, just to prove that "something" has been done in response from the activation.

The service has, as a single use case, the capability of listening to a signal coming from the sensor, and immediately activating the actuator in return, in addition to writing a log message to the standard output of the service process.

It's particularly interesting to write a message to the console for the following reason: any software system will of course run on a process of the operating system, which, as such, will have an output channel, which is STDOUT (and STDERR); however, we must not fall into the trap of thinking that this is also an output device available for the application, because what's an output device is defined by what the devices (or the actors) are, from a user stories/use cases point of view. In our system, the only two devices/actors that our application considers are the sensor and the actuator, none of which can be used as an output (in the usual textual sense) for the application. However, we can still use the console output as a logging channel if we want to, but this should be done by a different secondary adapter, and not by a traditional presenter, since in this case nothing is to be presented.

| type      | port            | adapter             |
| --------- | --------------- | ------------------- |
| primary   | `sensor`        | `sensor-system`     |
| secondary | `actuator`      | `file-actuator`     |
| secondary | `notifications` | `bus-notifications` |

| primary port | use case      | interactor   | input boundary | presenter | output boundary |
| ------------ | ------------- | ------------ | -------------- | --------- | --------------- |
| `sensor`     | `send_signal` | `SendSignal` | `Request`      | \<none\>  | \<none\>        |

| primary adapter | use case      | controller   | input boundary | presenter | output boundary |
| --------------- | ------------- | ------------ | -------------- | --------- | --------------- |
| `sensor-system` | `send_signal` | `Controller` | `Request`      | \<none\>  | \<none\>        |
