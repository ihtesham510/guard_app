import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUpForm } from '@/components/auth/sign-up-form'

export const Route = createFileRoute('/(auth)/sign-up')({
	component: SignUpForm,
	beforeLoad({ context: { session } }) {
		if (session.data) {
			throw redirect({
				to: '/dashboard',
			})
		}
	},
})
