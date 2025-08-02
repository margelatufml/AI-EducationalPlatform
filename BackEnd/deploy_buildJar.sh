#!/bin/bash

echo "Enter in the build Jar sh command..."
echo "Current working directory: $(pwd)"

PROJECT_DIR="/root/backend/intelectabackend"

cd $PROJECT_DIR || exit 1
echo "Navigated to project directory: $(pwd)"

# Check if JAVA_HOME is set and Java is installed
if [[ -z "$JAVA_HOME" || ! -x "$(command -v java)" ]]; then
  echo "ERROR: JAVA_HOME is not set or Java is not installed."
  exit 1
fi

# Ensure the gradlew file has execute permissions
chmod +x ./gradlew

# Build the bootable JAR
echo "Building the bootable JAR..."
./gradlew --no-daemon --info --stacktrace bootJar
echo "Current working directory: $(pwd)"
