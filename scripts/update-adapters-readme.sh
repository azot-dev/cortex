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
  echo "Auto-generating README.md for $dir"
  cd "$dir"

  filename=$(ls *.ts | head -1)
  base_name="${filename%.ts}"
  title=$(echo "$base_name" | sed 's/\./ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')
  package_name="$(jq -r '.name' package.json)"
  adapter_content=$(cat $(ls *.ts | head -1))
  gateway_content=$(cat $(ls ../*.ts | head -1))

  {
    echo "# $title"
    echo '## installation'
    echo ''
    echo '```sh'
    echo "npm i $package_name"
    echo '```'
    echo 'or'
    echo '```sh'
    echo "yarn add $package_name"
    echo '```'
    echo ''
    echo '## adapter'
    echo ''
    echo '```ts'
    echo "$adapter_content"
    echo '```'
    echo ''
    echo '## gateway'
    echo ''
    echo '```ts'
    echo "$gateway_content"
    echo '```'
  } >"README.md"

  cd -
done
