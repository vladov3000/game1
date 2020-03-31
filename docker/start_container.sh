#!/bin/bash
#port pass as arg is mapped to port 3000 inside the container

docker run --rm -p ${1:-8000}:5000 -v ~/game1:/game1 game1
