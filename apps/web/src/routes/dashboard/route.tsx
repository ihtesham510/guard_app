import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { AppSidebar } from '@/components/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useSession } from '@/hooks/use-session'

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	beforeLoad({ context: { session } }) {
		if (!session.data) {
			throw redirect({
				to: '/sign-in',
			})
		}
	},
})

function RouteComponent() {
	const { session } = useSession()
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--sidebar-height': 'calc(var(--spacing) * 16)',
				} as React.CSSProperties
			}
		>
			<AppSidebar
				user={{
					email: session.data!.user.email,
					name: session.data!.user.name,
					image: session.data!.user.image ?? undefined,
				}}
				variant='inset'
				collapsible='icon'
			/>
			<SidebarInset className='p-3'>
				<header className='flex justify-between items-center mb-4 w-full'>
					<span className='flex items-center gap-2'>
						<SidebarTrigger className='size-4' />
					</span>
					<div className='flex gap-2 items-center'>
						<ThemeToggle />
						<Button variant='ghost' size='sm' className='relative'>
							<Bell className='h-5 w-5' />
							<Badge className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary'>3</Badge>
						</Button>
					</div>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
