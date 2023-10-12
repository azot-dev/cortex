const fs = require('fs');
const path = require('path');

function createAdapter(adapterName, gatewayName) {
  const adapterPath = path.join(__dirname, '..', 'src', adapterName);

  // Vérifiez si l'adaptateur existe déjà
  if (fs.existsSync(adapterPath)) {
    console.error(`L'adaptateur "${adapterName}" existe déjà!`);
    return;
  }

  // Création du répertoire de l'adaptateur
  fs.mkdirSync(adapterPath, { recursive: true });

  // Création du fichier de l'adaptateur avec un template
  const adapterContent = `
import { ${gatewayName} } from '@azot-dev/cortex/core';

export class ${adapterName}Adapter implements ${gatewayName} {
  // Implémentez vos méthodes ici...
}
`;

  fs.writeFileSync(
    path.join(adapterPath, `${adapterName}.ts`),
    adapterContent.trim()
  );

  console.log(`L'adaptateur "${adapterName}" a été créé avec succès!`);
}

// Utilisation: node ce_script.js MonAdapteur MonGateway
const [adapterName, gatewayName] = process.argv.slice(2);
createAdapter(adapterName, gatewayName);
