#!/bin/bash
#port pass as arg is mapped to port 3000 inside the container

docker run --rm -p ${1:-8080}:3000 engl320-tests