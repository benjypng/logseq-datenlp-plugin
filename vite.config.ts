import { defineConfig } from "vite";
import logseqDevPlugin from "vite-plugin-logseq";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [logseqDevPlugin(), tsconfigPaths()],
});
