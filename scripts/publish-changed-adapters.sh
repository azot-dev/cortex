#!/bin/bash

ROOT_DIR="$(dirname "$0")/../adapters/src"

if [ ! -d "$ROOT_DIR" ]; then
  echo "Error: Could not find the expected directory at $ROOT_DIR."
  echo "Please ensure the script is placed in the right location and the directory structure is intact."
  exit 1
fi

for dir in $(find "$ROOT_DIR" -name 'package.json' -not -path '*node_modules*' | xargs dirname); do
  echo "Changes detected for $dir. Incrementing version and publishing..."
  cd "$dir"
  npm version minor -m "Bump minor version"
  npm publish --access public
  cd -
done
