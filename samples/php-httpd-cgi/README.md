# PHP with Apache httpd sample

Build the image:
```
$ bin/build
```

Start the container:
```
$ bin/start
```

Now browse to `0.0.0.0:8080/cgi_bin/test.php` to see a Web page rendered using PHP running over Sloth Machine (compiled from PHP and running over SM).

You can use `$ docker logs -f sm-httpd` to see the Web server logs.

To stop and remove the container:
```
$ bin/stop
```

You can create new sample PHP files along the lines of `test.php`, remembering to copy them into the image in Dockerfile, and to rebuild the image.
