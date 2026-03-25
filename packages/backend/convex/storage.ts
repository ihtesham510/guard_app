import { v } from 'convex/values'
import { action } from './_generated/server'

export const getFileUrl = action({
	args: {
		storageId: v.id('_storage'),
	},
	async handler(ctx, { storageId }) {
		return await ctx.storage.getUrl(storageId)
	},
})

export const getUploadUrl = action({
	async handler(ctx) {
		return await ctx.storage.generateUploadUrl()
	},
})
