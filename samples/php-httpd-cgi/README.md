# PHP with Apache sample

Build the image:
```
$ bin/build
```

Start the container:
```
$ bin/start
```

No browse to `0.0.0.0:8080/cgi_bin/test.php` to see a Web page rendered using PHP running over Sloth Machine (compiled from PHP and running over SM).

To stop and remove the container:
```
$ bin/stop
```

You can create new sample PHP files along the lines of `test.php`, remembering to copy them into the image in Dockerfile, and to rebuild the image.
