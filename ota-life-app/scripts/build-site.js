// Exports the web build into ../site/app for the showcase page (served under /app).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../site/app');
execSync(`npx expo export --platform web --output-dir "${out}" --clear`, { stdio: 'inherit', env: { ...process.env, EXPO_BASE_URL: '/app' } });

// Hosts like Vercel drop any folder named node_modules from a deploy, which takes the
// fonts and images with it. Move them to assets/pkg and point the bundles at the new path.
const from = path.join(out, 'assets/node_modules'), to = path.join(out, 'assets/pkg');
if (fs.existsSync(from)) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.renameSync(from, to);
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walk(path.join(out, '_expo')).filter(f => f.endsWith('.js'))) {
    const s = fs.readFileSync(f, 'utf8');
    if (s.includes('assets/node_modules')) fs.writeFileSync(f, s.split('assets/node_modules').join('assets/pkg'));
  }
}
console.log('Showcase app exported to ' + out);
