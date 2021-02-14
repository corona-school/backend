#!/bin/bash

# for reference: https://npm.community/t/let-npm-scripts-change-environment-of-the-current-shell-to-run-scripts-in-a-current-shell-instead-of-a-subshell/6944

# runs a package.json script, but not how npm does (i.e. in a subshell)
# advantages: now sending SIGTERM to npm not immediately terminates our app

# run with a script name as first arg, defaults to "start"
script=${1:start}

cmd=$(node -e "console.log(require('./package.json').scripts['${script}'])")
echo $cmd

# set the path like npm run does
# note that all the OTHER npm envs are not set, so
# that's left as an exercise for the reader.
export PATH=$PWD/node_modules/.bin:$PATH
exec $cmd