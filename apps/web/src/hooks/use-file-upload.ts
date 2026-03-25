import { api } from '@repo/backend'
import { useAction } from 'convex/react'

export function useFileUpload() {
	const getUploadUrl = useAction(api.storage.getUploadUrl)
	const getFileUrl = useAction(api.storage.getFileUrl)
	return async (file: File) => {
		const url = await getUploadUrl()
		const result = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': file!.type },
			body: file,
		})
		const res = await result.json()
		const fileUrl = await getFileUrl({ storageId: res.storageId })
		return { url: fileUrl!, storageId: res.storageId }
	}
}
