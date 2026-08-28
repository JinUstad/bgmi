const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/app');

const filesToFix = [
  { file: 'page.tsx', type: 'home' },
  { file: 'about/page.tsx', type: 'about' },
  { file: 'tournaments/page.tsx', type: 'tournaments' },
  { file: 'faq/page.tsx', type: 'faq' },
  { file: 'registration/page.tsx', type: 'registration' },
  { file: 'past-streams/page.tsx', type: 'past-streams' },
  { file: 'privacy/page.tsx', type: 'privacy' },
  { file: 'terms/page.tsx', type: 'terms' },
  { file: 'terms-of-service/page.tsx', type: 'terms-of-service' },
  { file: 'results/page.tsx', type: 'results', hasMetadata: false }, // Results doesn't have metadata currently? Wait, let's check.
  { file: 'blogs/page.tsx', type: 'blogs' }
];

filesToFix.forEach(({ file, type }) => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if missing
  if (!content.includes('generateDynamicMetadata')) {
    // find import { generatePageMetadata } and replace
    if (content.includes('import { generatePageMetadata } from "@/lib/seo/metadata";')) {
      content = content.replace(
        'import { generatePageMetadata } from "@/lib/seo/metadata";',
        'import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";'
      );
    } else {
       // just prepend
       const firstImportMatch = content.match(/import /);
       if (firstImportMatch) {
         content = content.substring(0, firstImportMatch.index) + 'import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";\n' + content.substring(firstImportMatch.index);
       }
    }
  }

  // Find export const metadata: Metadata = generatePageMetadata({ ... });
  // This is a multiline regex replacement. We need to match from `export const metadata: Metadata = generatePageMetadata({` to the closing `});`
  const metadataRegex = /export const metadata:\s*Metadata\s*=\s*generatePageMetadata\(\{[^]*?\}\);\n?/g;
  
  if (metadataRegex.test(content)) {
    content = content.replace(metadataRegex, `export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("${type}");
}
`);
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  } else {
    console.log(`No match in ${file} or already fixed`);
  }
});
