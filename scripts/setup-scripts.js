
const fs = require('fs');
const path = require('path');

// Function to add missing scripts to package.json
function addMissingScripts() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  try {
    // Read the current package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if the scripts section exists, if not create it
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Add the missing dev script if it doesn't exist
    let modified = false;
    
    if (!packageJson.scripts.dev) {
      packageJson.scripts.dev = 'node src/server.js';
      console.log('Added "dev" script to package.json');
      modified = true;
    }
    
    if (!packageJson.scripts['build:dev']) {
      packageJson.scripts['build:dev'] = 'vite build --mode development';
      console.log('Added "build:dev" script to package.json');
      modified = true;
    }
    
    // Write the updated package.json if changes were made
    if (modified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Successfully updated package.json');
    } else {
      console.log('No changes needed in package.json, all required scripts already exist');
    }
    
  } catch (error) {
    console.error('Error updating package.json:', error.message);
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  addMissingScripts();
}

module.exports = {
  addMissingScripts
};
