/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		tailwindcss(),
		react(),
		tsconfigPaths(),
	],
	test: {
		environment: 'happy-dom',
		setupFiles: './src/testing/setupTestingLibrary.ts',
	},
});
