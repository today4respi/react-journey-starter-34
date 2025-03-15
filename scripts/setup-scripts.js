
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Read the package.json file
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the missing scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "node src/server.js",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "web": "expo start --web",
    "start:web": "vite"
  };
  
  // Write the updated package.json file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Successfully added missing scripts to package.json');
} catch (error) {
  console.error('Error updating package.json:', error);
}
