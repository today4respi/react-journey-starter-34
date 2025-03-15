
const fs = require('fs');
const path = require('path');

// Function to add dev script to package.json if it doesn't exist
function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  // Read the existing package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if the dev script already exists
    if (!packageJson.scripts || !packageJson.scripts.dev) {
      console.log('Adding "dev" script to package.json...');
      
      // Add the dev script
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      packageJson.scripts.dev = 'node src/server.js';
      
      // Check if build:dev script exists
      if (!packageJson.scripts['build:dev']) {
        packageJson.scripts['build:dev'] = 'vite build --mode development';
      }
      
      // Write the updated package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Successfully added "dev" and "build:dev" scripts to package.json!');
      console.log('\nYou can now run the server with: npm run dev');
    } else {
      console.log('The "dev" script already exists in package.json.');
    }
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// Run the update function
updatePackageJson();
