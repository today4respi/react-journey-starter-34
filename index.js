
import { registerRootComponent } from 'expo';
import App from './App';

// Register the main component
registerRootComponent(App);

// For web support
if (module.hot) {
  module.hot.accept();
}

// IMPORTANT: Make sure you have the following scripts in your package.json file:
// "scripts": {
//   "start": "expo start",
//   "dev": "expo start",
//   "build:dev": "vite build --mode development"
// }
// These scripts are required for proper building of the app
// You need to run 'npm run dev' to start the development server
// Or run 'node setup.js' to add these scripts automatically
