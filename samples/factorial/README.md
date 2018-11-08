# Calculate factorial sample

Build the image:
```
$ bin/build
```

Get to the command line of a new container:
```
$ bin/run
#
```

From inside the container, calculate the factorial of a given number, passing it from STDIN, and read the result from the exit status:
```
# echo 3 | bin/sm factorial.basm
# echo $?
6
# echo 5 | bin/sm factorial.basm
# echo $?
120
```
