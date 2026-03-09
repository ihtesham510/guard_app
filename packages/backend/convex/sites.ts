import { mutation, query } from './_generated/server'
import { getUser } from './auth'
import { siteSchema } from './schema'

export const getSites = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		return await ctx.db
			.query('site')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()
	},
})

export const addSite = mutation({
	args: siteSchema.omit('userId'),
	async handler(ctx, args) {
		const user = await getUser(ctx)
		const userId = user._id
		return await ctx.db.insert('site', { ...args, userId })
	},
})
