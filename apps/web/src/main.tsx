import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import ReactDOM from 'react-dom/client'
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
	const convex_url = process.env.CONVEX_URL
	if (!convex_url) throw new Error('Convex url not found')
	const client = new ConvexReactClient(convex_url)
	return (
		<ConvexProvider client={client}>
			<RouterProvider router={router} context={{ convexClient: client }} />
		</ConvexProvider>
	)
}
