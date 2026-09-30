import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  { ignores: [".next/**", "node_modules/**", "output/**", "public/**", "next-env.d.ts"] },
]);
