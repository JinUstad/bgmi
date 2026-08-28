const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Recursively find all .tsx files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Generic replacements for static text that doesn't need to be fully dynamic, just agnostic
  content = content.replace(/BGMI ID/g, 'In-Game ID');
  content = content.replace(/BGMI's classic battle royale mode/g, 'the classic battle mode');
  content = content.replace(/BGMI's official gameplay rules/g, 'the official gameplay rules');
  content = content.replace(/official BGMI point system/g, 'official point system');
  content = content.replace(/BGMI tournaments/g, 'Esports tournaments');
  content = content.replace(/BGMI Tournament/g, 'Esports Tournament');
  content = content.replace(/bgmi_india\.mp3/g, 'theme_music.mp3'); // We'll need to use activeGame.assets.audio or fallback

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    count++;
  }
}
console.log(`Updated ${count} files.`);
