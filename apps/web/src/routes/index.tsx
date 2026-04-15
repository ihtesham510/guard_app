import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	const { session, signOut } = useSession()
	if (session.data) {
		return (
			<div className='flex h-screen w-full flex-col items-center justify-center gap-6'>
				<h1 className='font-bold text-3xl'>Welcome {session.data.user.name}</h1>
				<Button onClick={signOut}>Sign out</Button>
			</div>
		)
	}
	return (
		<div>
			<Link to='/sign-in'>
				<Button>Sign In</Button>
			</Link>
		</div>
	)
}
