import { api } from '@repo/backend'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'

export const Route = createFileRoute('/')({ component: App })

function App() {
	const hellow = useQuery(api.hellow.hellow)
	return <button type='button'> message : {hellow}</button>
}
