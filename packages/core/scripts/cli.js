#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");

function displayCode() {
  const RESET = "\x1b[0m";
  const RED = "\x1b[31m";
  const GREEN = "\x1b[32m";
  const YELLOW = "\x1b[33m";
  const BLUE = "\x1b[34m";

  let code = `
  <CortexProvider core={createCore()}>
    <App />
  </CortexProvider>
  `;

  code = code.replace(/CortexProvider/g, `${GREEN}CortexProvider${RESET}`);
  code = code.replace(/App/g, `${GREEN}App${RESET}`);
  code = code.replace(/createCore/g, `${GREEN}createCore${RESET}`);
  code = code.replace(/coreInstance/g, `${BLUE}core${RESET}`);
  code = code.replace(/{/g, `${YELLOW}{${RESET}`);
  code = code.replace(/}/g, `${YELLOW}}${RESET}`);
  code = code.replace(/\(/g, `${RED}(${RESET}`);
  code = code.replace(/\)/g, `${RED})${RESET}`);

  console.info(code);
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
      copyRecursively(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

yargs
  .command(
    "init [library]",
    "Initialize cortex with a specific library",
    (yargs) => {
      yargs.positional("library", {
        describe: "The library to initialize (e.g., react)",
        type: "string",
      });
    },
    (argv) => {
      if (argv.library) {
        const sourceDirectory = path.join(__dirname, argv.library);
        const destinationDirectory = process.cwd();

        console.info();
        if (fs.existsSync(sourceDirectory)) {
          copyRecursively(sourceDirectory, destinationDirectory);
          console.log(`Initialization of Cortex with ${argv.library} completed 👌`);
        } else {
          console.error(`The library "${argv.library}" is not recognized.`);
        }
        console.info("You need to wrap your app with the CortexProvider to use it with React");
        displayCode();
      }
    }
  )
  .help().argv;
