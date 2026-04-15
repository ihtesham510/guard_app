import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import type { ConvexReactClient } from 'convex/react'
import type { authClient } from '@/lib/auth-client'

import '../styles.css'

export const Route = createRootRouteWithContext<{
	authClient: typeof authClient
	session: ReturnType<typeof authClient.useSession>
	convex: ConvexReactClient
}>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackDevtools
				config={{
					position: 'bottom-right',
				}}
				plugins={[
					{
						name: 'TanStack Router',
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	)
}
