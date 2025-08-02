#!/bin/bash

# Debug: Print the current working directory
echo "Working on running the JAR file with nohup"

PROJECT_DIR="/root/backend/intelectabackend"

cd $PROJECT_DIR || exit
echo "Navigated to project directory: $(pwd)"

# Ensure the gradlew file has execute permissions
chmod +x ./gradlew


cd build/libs || exit
echo "Current working directory: $(pwd)"

# Start the Spring Boot applicatio
echo "Starting the Spring Boot application...."
# shellcheck disable=SC2024
sudo nohup java -jar IntelectaBackEnd-0.0.1-SNAPSHOT.jar > output.log &
echo "Application started"
exit
