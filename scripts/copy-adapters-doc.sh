#!/bin/bash

# Determine the root directory based on the script's location
SOURCE_DIR="$(dirname "$0")/../adapters/src"

# Ensure the SOURCE_DIR exists before proceeding
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Could not find the expected directory at $SOURCE_DIR."
  echo "Please ensure the script is placed in the right location and the directory structure is intact."
  exit 1
fi

DEST_DIR="$(dirname "$0")/../doc/docs/Adapters"

rm -rf $DEST_DIR/*
rsync -av --exclude='node_modules/' --include='*/' --include='README.md' --exclude='*' "$SOURCE_DIR/" "$DEST_DIR/"

cd $DEST_DIR

for dir in */; do
  echo dir $dir
  for sub_dir in $dir*; do
    echo sub_dir $sub_dir
    filename=$(echo "$sub_dir" | cut -d'/' -f2)
    mv "$sub_dir/README.md" "$dir"
    rm -rf "$dir$filename"
    mv "$dir/README.md" "$dir$filename.md"
  done
done
