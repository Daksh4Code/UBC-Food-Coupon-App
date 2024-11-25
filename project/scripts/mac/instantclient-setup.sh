#!/bin/bash

# Change to the directory where the script is located
cd "/Users/daksh/project_m1g3t_q1i7x_w5i1d/project/scripts/mac/" || exit

echo "Please enter the absolute path to the Oracle Instant Client directory:"
read "/Users/daksh/instantclient_19_8"

# Construct the local start script
(
echo '#!/bin/bash'
echo
echo '# Change to the directory where the script is located'
echo 'cd "$(dirname "$0")" || exit'
echo
echo "# Configure the oracle instant client env variable"
echo "export DYLD_LIBRARY_PATH=$oraclePath:\$DYLD_LIBRARY_PATH"
echo
echo "# Start Node application"
echo "exec node server.js"
) > ../../local-start.sh

# Change the permissions of the script to make it executable
chmod +x ../../local-start.sh
echo "--------------------------------------------------------------------------"
echo "Setup complete. Run 'sh local-start.sh' in your project folder to start your Node.js application."
echo "--------------------------------------------------------------------------"

exit 0