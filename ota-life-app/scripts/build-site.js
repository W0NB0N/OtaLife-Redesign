// Builds the showcase website: exports the web app into ../site/app with the /app base path.
const { execSync } = require('child_process');
const path = require('path');
const out = path.resolve(__dirname, '../../site/app');
execSync(`npx expo export --platform web --output-dir "${out}" --clear`, { stdio: 'inherit', env: { ...process.env, EXPO_BASE_URL: '/app' } });
console.log('Showcase app exported to', out);
