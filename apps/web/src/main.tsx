import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useConvex } from 'convex/react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
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
				<Toaster />
				<App />
			</ConvexProvider>
		</ThemeProvider>,
	)
}

function App() {
	const session = authClient.useSession()
	const convex = useConvex()
	if (session.isPending) {
		return (
			<div className='flex h-screen w-full items-center justify-center'>
				<Spinner className='size-8' />
			</div>
		)
	}
	return <RouterProvider router={router} context={{ authClient, session, convex }} />
}
