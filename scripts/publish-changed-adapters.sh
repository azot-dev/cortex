#!/bin/bash

# Determine the root directory based on the script's location
ROOT_DIR="$(dirname "$0")/../adapters/src"

# Ensure the ROOT_DIR exists before proceeding
if [ ! -d "$ROOT_DIR" ]; then
  echo "Error: Could not find the expected directory at $ROOT_DIR."
  echo "Please ensure the script is placed in the right location and the directory structure is intact."
  exit 1
fi

# Search for all directories containing a package.json inside ./adapters/src
for dir in $(find "$ROOT_DIR" -name 'package.json' -not -path '*node_modules*' | xargs dirname); do
  # Check if there are changes in the directory compared to the last tag
  if git diff --quiet HEAD $(git describe --tags --abbrev=0) -- "$dir"; then
    echo "No changes detected for $dir. Moving on to the next."
    continue # Skip if there are no modifications
  fi

  echo "Changes detected for $dir. Incrementing version and publishing..."

  cd "$dir"

  # Increment the minor version
  npm version minor -m "Bump minor version"

  # Publish to npm
  npm publish --access public

  cd - # Return to the previous directory
done
