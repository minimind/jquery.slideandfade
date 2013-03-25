#!/bin/sh

java -jar libs/closure/compiler.jar --js jquery.slideandfade.js --js_output_file jquery.slideandfade.min.js --compilation_level SIMPLE_OPTIMIZATIONS
