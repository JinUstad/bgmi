const fs = require('fs');
const path = require('path');

const directories = [
  'd:/myWork/bgmi/bgmi-web/src/components',
  'd:/myWork/bgmi/bgmi-web/src/app',
];

const replacements = [
  { regex: /text-pubg-yellow/g, replacement: 'text-[var(--theme-primary)]' },
  { regex: /bg-pubg-yellow/g, replacement: 'bg-[var(--theme-primary)]' },
  { regex: /border-pubg-yellow/g, replacement: 'border-[var(--theme-primary)]' },
  { regex: /from-pubg-yellow/g, replacement: 'from-[var(--theme-primary)]' },
  { regex: /to-pubg-yellow/g, replacement: 'to-[var(--theme-primary)]' },
  { regex: /via-pubg-yellow/g, replacement: 'via-[var(--theme-primary)]' },
  { regex: /text-orange-accent/g, replacement: 'text-[var(--theme-accent)]' },
  { regex: /bg-orange-accent/g, replacement: 'bg-[var(--theme-accent)]' },
  { regex: /border-orange-accent/g, replacement: 'border-[var(--theme-accent)]' },
  { regex: /text-tactical-black/g, replacement: 'text-[var(--theme-bg)]' },
  { regex: /bg-tactical-black/g, replacement: 'bg-[var(--theme-bg)]' },
  { regex: /border-tactical-black/g, replacement: 'border-[var(--theme-bg)]' },
  { regex: /text-military-green/g, replacement: 'text-[var(--theme-secondary)]' },
  { regex: /bg-military-green/g, replacement: 'bg-[var(--theme-secondary)]' },
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

directories.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      replacements.forEach(r => {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replacement);
          changed = true;
        }
      });
      
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
});

console.log("Replacement complete.");
