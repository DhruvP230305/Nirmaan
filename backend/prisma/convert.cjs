const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace String[] with String
content = content.replace(/String\[\]\s*@default\(\[\]\)/g, 'String @default("")');
content = content.replace(/String\[\]/g, 'String');

fs.writeFileSync(schemaPath, content);
console.log('Done converting arrays to strings');
