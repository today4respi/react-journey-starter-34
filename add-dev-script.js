
const fs = require('fs');
const path = require('path');

try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Add dev script if it doesn't exist
  if (!packageJson.scripts.dev) {
    packageJson.scripts.dev = "vite";
    console.log('Added "dev" script to package.json');
  }
  
  // Add build:dev script if it doesn't exist
  if (!packageJson.scripts['build:dev']) {
    packageJson.scripts['build:dev'] = "vite build --mode development";
    console.log('Added "build:dev" script to package.json');
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('package.json updated successfully!');
} catch (error) {
  console.error('Error updating package.json:', error);
}
