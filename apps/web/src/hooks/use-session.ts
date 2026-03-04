import { useRouteContext, useRouter } from '@tanstack/react-router'

export const useSession = () => {
	const { session, authClient } = useRouteContext({ from: '__root__' })
	const router = useRouter()
	const signIn = async (data: Parameters<typeof authClient.signIn.email>[0]) => {
		await authClient.signIn.email(data)
		await router.invalidate()
	}
	const signUp = async (data: Parameters<typeof authClient.signUp.email>[0]) => {
		await authClient.signUp.email(data)
		await router.invalidate()
	}
	const signOut = async () => {
		await authClient.signOut()
		await router.invalidate()
	}
	return { session, signIn, signUp, signOut }
}
