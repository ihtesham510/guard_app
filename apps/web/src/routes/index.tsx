import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({ component: App })

function App() {
	const session = authClient.useSession()
	const [email, setEmail] = useState<string>()
	const [password, setPassword] = useState<string>()
	const handleSubmit = async () => {
		if (!email || !password) return
		await authClient.signIn.email({
			email,
			password,
		})
	}
	return (
		<div>
			{session.data ? (
				<div>
					<h1> welcome {session.data.user.name}</h1>
				</div>
			) : (
				<div className='grid gap-8'>
					<div className='grid'>
						<label htmlFor='email'>Email</label>
						<input id='email' type='text' value={email} className='border-border border' onChange={e => setEmail(e.target.value)} />
					</div>
					<div className='grid'>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							type='text'
							value={password}
							className='border-border border'
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<button type='button' onClick={handleSubmit}>
						Submit
					</button>
				</div>
			)}
		</div>
	)
}
