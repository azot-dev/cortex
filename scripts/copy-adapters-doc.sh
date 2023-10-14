#!/bin/bash

# Determine the root directory based on the script's location
SOURCE_DIR="$(dirname "$0")/../adapters/src"

# Ensure the SOURCE_DIR exists before proceeding
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Could not find the expected directory at $SOURCE_DIR."
  echo "Please ensure the script is placed in the right location and the directory structure is intact."
  exit 1
fi

DEST_DIR="/path/to/destination"

rsync -av --include='*/' --include='README.md' --exclude='*' "$SOURCE_DIR/" "$DEST_DIR/"
