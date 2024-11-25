#!/bin/bash

# Change to the directory where the script is located
cd "/Users/daksh/project_m1g3t_q1i7x_w5i1d/project/" || exit

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=:$DYLD_LIBRARY_PATH

# Start Node application
exec node server.js
