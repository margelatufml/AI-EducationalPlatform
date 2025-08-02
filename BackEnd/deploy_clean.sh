#!/bin/bash

# Debug: Print the current working directory
echo "Current working directory before cleaning: $(pwd)"

# Ensure the target directory exists
if [ ! -d "/root/backend" ]; then
  mkdir -p /root/backend
fi

cd /root/backend || exit 1

# Remove old repository if it exists to avoid conflicts
if [ -d "intelectabackend" ]; then
  echo "Removing old repository directory..."
  rm -rf intelectabackend
fi

echo "Current working directory: $(pwd)"

# Clone the repository from the Development branch
REPO_URL="git@gitlab.com:AlexS1234/intelectabackend.git"  # Update this to your actual repository URL

echo "Cloning the repository from the Development branch..."
git clone --branch Development $REPO_URL intelectabackend

if [ $? -ne 0 ]; then
  echo "Failed to clone the repository."
  exit 1
fi

cd intelectabackend || exit 1
echo "Navigated to project directory: $(pwd)"

# Ensure gradlew exists and is executable
if [ ! -f "./gradlew" ]; then
  echo "gradlew file not found. Exiting..."
  exit 1
fi

chmod +x ./gradlew
