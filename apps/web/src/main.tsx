import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import ReactDOM from 'react-dom/client'
import { authClient } from './lib/auth-client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
	routeTree,
	context: undefined!,
	defaultPreload: 'intent',
	scrollRestoration: true,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<App />)
}

function App() {
	const convex_url = import.meta.env.VITE_CONVEX_URL
	if (!convex_url) throw new Error('Convex url not found')
	const client = new ConvexReactClient(convex_url, {
		expectAuth: true,
	})
	return (
		<ConvexProvider client={client}>
			<ConvexBetterAuthProvider client={client} authClient={authClient}>
				<RouterProvider router={router} context={{ convexClient: client }} />
			</ConvexBetterAuthProvider>
		</ConvexProvider>
	)
}
