const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log(`
Usage:
  create-adapter.js [framework] [purpose]

Examples:
  create-adapter.js react storage
  create-adapter.js vue api
`);
  process.exit(1);
}

const [framework, purpose] = args;

const rootPath = path.join(__dirname, '..', 'src', purpose, framework);
const purposeDir = path.join(__dirname, '..', 'src', purpose);
const gatewayFilePath = path.join(purposeDir, `${purpose}.gateway.ts`);
const adapterFileName = `${framework}.${purpose}.adapter.ts`;
const adapterClassName = `${capitalizeFirstLetter(
  framework
)}${capitalizeFirstLetter(purpose)}Adapter`;
const gatewayName = `${capitalizeFirstLetter(purpose)}Gateway`;

// Helper function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create the 'purpose' directory if it doesn't exist
if (!fs.existsSync(purposeDir)) {
  fs.mkdirSync(purposeDir, { recursive: true });
}

// Check if gateway file already exists
if (!fs.existsSync(gatewayFilePath)) {
  const gatewayContent = `
export interface ${gatewayName} {
  // TODO: Define the methods for this gateway
}
`;

  fs.writeFileSync(gatewayFilePath, gatewayContent.trim());
  console.log(`Gateway created at: ${gatewayFilePath}`);
}

// Create the directories if they don't exist
fs.mkdirSync(rootPath, { recursive: true });

// Generate the adapter file content
const adapterContent = `
export * from '../${purpose}.gateway'; // This exports the gateway

import { ${gatewayName} } from '../${purpose}.gateway';

export class ${adapterClassName} implements ${gatewayName} {
  // TODO: Implement the methods
}
`;

fs.writeFileSync(path.join(rootPath, adapterFileName), adapterContent.trim());

// Create package.json, README.md, and .gitignore inside the framework folder

const readmeContent = '# TODO: Add documentation for this adapter.';
fs.writeFileSync(path.join(rootPath, 'README.md'), readmeContent.trim());

const gitignoreContent = 'node_modules/';
fs.writeFileSync(path.join(rootPath, '.gitignore'), gitignoreContent.trim());

const packageJsonContent = {
  name: `@azot-dev/cortex/adapters/${purpose}/${framework}`,
  version: '0.0.1',
  main: adapterFileName,
};

fs.writeFileSync(
  path.join(rootPath, 'package.json'),
  JSON.stringify(packageJsonContent, null, 2)
);

console.log(`Adapter created at: ${rootPath}/${adapterFileName}`);
