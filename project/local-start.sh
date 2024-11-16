#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=/Users/pearl/Downloads/instantclient_19_8:$DYLD_LIBRARY_PATH

# Start Node application
exec node server.js
