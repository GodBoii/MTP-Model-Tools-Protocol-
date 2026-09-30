import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  { files: ["components/Providers.tsx"], rules: { "react-hooks/set-state-in-effect": "off" } },
  { ignores: [".next/**", "node_modules/**", "output/**", "public/**", "next-env.d.ts"] },
]);
