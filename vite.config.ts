import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2018',
    minify: false,
    lib: {
      // Define the entry point
      entry: resolve(__dirname, 'src/index.ts'),
      // Name for UMD builds
      name: 'TsIoc',
      // Generate multiple formats
      formats: ['es', 'cjs', 'umd'],
      // Output file names
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: [],
    },
  },
  plugins: [
    // Configure dts plugin to exclude playground and tests
    dts({
      exclude: ['src/playground/**', 'src/tests/**'],
    }),
  ],
});
