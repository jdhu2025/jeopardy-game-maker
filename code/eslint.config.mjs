import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores([
    '.next/**',
    '.open-next/**',
    'public/**',
    'src/shared/types/cloudflare.d.ts',
  ]),
]);
