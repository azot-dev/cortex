#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

function copyRecursively(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursively(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

yargs
  .command(
    'init [library]',
    'Initialize cortex with a specific library',
    (yargs) => {
      yargs.positional('library', {
        describe: 'The library to initialize (e.g., react)',
        type: 'string',
      });
    },
    (argv) => {
      if (argv.library) {
        const sourceDirectory = path.join(__dirname, argv.library);
        const destinationDirectory = process.cwd();

        if (fs.existsSync(sourceDirectory)) {
          copyRecursively(sourceDirectory, destinationDirectory);
          console.log(`Initialization of ${argv.library} completed!`);
        } else {
          console.error(`The library "${argv.library}" is not recognized.`);
        }
        console.info();
        console.info(
          'Package successfully installed, you need to wrap your app with the CortexProvider to use it with React'
        );
      }
    }
  )
  .help().argv;
