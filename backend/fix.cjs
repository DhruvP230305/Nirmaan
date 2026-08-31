const fs = require('fs');
const path = require('path');

const replaceInFile = (file, search, replace) => {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(p, content);
  }
}

// 1. Fix Schema imports
replaceInFile('src/schemas/auth.schema.ts', /import \{ Role \} from '@prisma\/client';/, `import { Role } from '../types/index.js';`);
replaceInFile('src/schemas/order.schema.ts', /import \{ OrderStatus, PaymentStatus \} from '@prisma\/client';/, `import { OrderStatus, PaymentStatus } from '../types/index.js';`);
replaceInFile('src/schemas/rfq.schema.ts', /import \{ QuoteStatus \} from '@prisma\/client';/, `import { QuoteStatus } from '../types/index.js';`);

// 2. Fix Service imports
replaceInFile('src/services/auth.service.ts', /import \{ Role \} from '@prisma\/client';/, `import { Role } from '../types/index.js';`);
replaceInFile('src/services/order.service.ts', /import \{ Prisma, Role \} from '@prisma\/client';/, `import { Prisma } from '@prisma/client';\nimport { Role } from '../types/index.js';`);
replaceInFile('src/services/rfq.service.ts', /import \{ Role, RFQStatus, QuoteStatus \} from '@prisma\/client';/, `import { Role, RFQStatus, QuoteStatus } from '../types/index.js';`);

// 3. Fix express.d.ts
replaceInFile('src/types/express.d.ts', /import \{ Role \} from '@prisma\/client';/, `import { Role } from './index.js';`);

// 4. Fix String[] assignment errors
// In src/services/manufacturer.service.ts
replaceInFile('src/services/manufacturer.service.ts', /certifications: input\.certifications,/, `certifications: input.certifications ? JSON.stringify(input.certifications) : undefined,`);

// In src/services/product.service.ts
replaceInFile('src/services/product.service.ts', /images: data\.images,/, `images: data.images ? JSON.stringify(data.images) : undefined,`);
replaceInFile('src/services/product.service.ts', /images: input\.images,/, `images: input.images ? JSON.stringify(input.images) : undefined,`);
replaceInFile('src/services/product.service.ts', /categoryId: data\.categoryId/, `categoryId: data.categoryId || null`);

// In src/services/packaging.service.ts
replaceInFile('src/services/packaging.service.ts', /images: data\.images,/, `images: data.images ? JSON.stringify(data.images) : undefined,`);

// In src/services/auth.service.ts
replaceInFile('src/services/auth.service.ts', /certifications: input\.certifications,/, `certifications: input.certifications ? JSON.stringify(input.certifications) : undefined,`);

console.log('Fixes applied.');
