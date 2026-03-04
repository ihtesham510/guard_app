import { useState } from 'react'

interface AsyncActionProps {
	fn: () => Promise<void> | void
	onSuccess?: () => Promise<void> | void
	onSettled?: () => Promise<void> | void
	onError?: (error: Error | unknown | never) => Promise<void> | void
}

export function useAsyncAction(props: AsyncActionProps) {
	const [isPending, setIsPending] = useState(false)
	async function mutate() {
		try {
			setIsPending(true)
			await props.fn()
			await props.onSuccess?.()
		} catch (error) {
			await props.onError?.(error)
		} finally {
			await props.onSettled?.()
			setIsPending(false)
		}
	}
	return { mutate, isPending }
}
