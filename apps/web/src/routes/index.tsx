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
			<div className='flex flex-col gap-6 justify-center items-center h-screen w-full'>
				<h1 className='text-3xl font-bold'>Welcome {session.data.user.name}</h1>
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
