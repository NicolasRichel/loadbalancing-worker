#!/bin/bash

# Check that NodeJS is installed
if ! type "node" > /dev/null 2>&1; then
  echo "You need to have NodeJS installed to run this script."
  exit 0
fi

# Check that Chromium is installed
# Note :
#   since the TestRunner use dynamic import and chromium is
#   currently the only browser that support this technology,
#   it is required to run tests.
if ! type "chromium-browser" > /dev/null 2>&1; then
  echo "You need to have Chromium web browser installed to run this script."
  exit 0
fi

# Check that 'http-server' package is installed
# If not, ask for global installation
if ! type "http-server" > /dev/null 2>&1; then
  echo "This run script use the 'http-server' npm package."
  echo "The package 'http-server' is not installed yet."
  read -p "Would you like to install it globally ( npm install -g http-server ) ? (y/N) " INPUT
  if [ "$INPUT" = "y" ] || [ "$INPUT" = "Y" ]; then
    npm install -g http-server
  else
    exit 0
  fi
fi

# Set port number (9000 by default)
PORT=$1
if [ -z "$PORT" ]; then
  PORT=9000
fi

# Serve test directory locally
echo "Starting HTTP server..."
http-server -p $PORT . > /dev/null &
PID=$!
echo "Server started (PID: $PID) and listening on port $PORT."

# Open spec tests page in Chromium
echo -n "Launching Chromium web browser... "
chromium-browser http://localhost:$PORT/specification/tests.html > /dev/null &
echo "Browser launched."

echo "Type 'q' to stop HTTP server."
INPUT=""
while [ ! "$INPUT" = "q" ]; do
  read INPUT
done
kill $PID

exit 0
