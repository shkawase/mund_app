import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills}  from "vite-plugin-node-polyfills";

console.log("Renderer Vite config is loaded");

export default defineConfig({
  base: './',
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true, // Node.js モジュールのポリフィルを有効化
    }),
  ],
  resolve: {
    alias: {
 // process をブラウザ互換に置き換え
    },
  },
});
