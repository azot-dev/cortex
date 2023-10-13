#!/bin/bash

for dir in $(find . -name 'package.json' -not -path './node_modules/*' | xargs dirname); do
  if git diff --quiet HEAD $(git describe --tags --abbrev=0) -- $dir; then
    continue
  fi
  cd $dir
  npm version minor -m "Bump minor version"
  npm publish
  cd -
done
