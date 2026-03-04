import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { ConvexProvider } from '@/components/providers/convex-provider'
import { Spinner } from '@/components/ui/spinner'
import { ThemeProvider } from '@/context/theme-context'
import { authClient } from '@/lib/auth-client'
import { routeTree } from '@/routeTree.gen'

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
	root.render(
		<ThemeProvider>
			<ConvexProvider>
				<App />
			</ConvexProvider>
			,
		</ThemeProvider>,
	)
}

function App() {
	const session = authClient.useSession()
	if (session.isPending) {
		return (
			<div className='flex justify-center items-center h-screen w-full'>
				<Spinner className='size-8' />
			</div>
		)
	}
	return <RouterProvider router={router} context={{ authClient, session }} />
}
