import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config = defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	return {
		define: {
			'process.env': env,
		},
		plugins: [
			devtools(),
			tsconfigPaths({ projects: ['./tsconfig.json'] }),
			tailwindcss(),
			tanstackRouter({ target: 'react', autoCodeSplitting: true }),
			viteReact(),
		],
	}
})

export default config
