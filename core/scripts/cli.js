#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('script called');

function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (err) {
    return false;
  }
}

function checkAndInstallPackage(packageName) {
  if (!isPackageInstalled(packageName)) {
    console.log(
      `The package ${packageName} is not installed. Installing now...`
    );
    try {
      execSync(`npm install ${packageName} --save`, { stdio: 'inherit' });
      console.log(
        `The package ${packageName} has been successfully installed.`
      );
    } catch (error) {
      console.error(
        `Error while installing the package ${packageName}.`,
        error
      );
    }
  } else {
    console.log(`The package ${packageName} is already installed.`);
  }
}

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

        checkAndInstallPackage('@azot-dev/cortex');
        checkAndInstallPackage('@azot-dev/react-cortex');
        checkAndInstallPackage('@legend-app/state');
      }
    }
  )
  .help().argv;
