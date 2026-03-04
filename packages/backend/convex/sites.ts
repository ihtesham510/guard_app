import { query } from './_generated/server'
import { getUser } from './auth'

export const getSites = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		return await ctx.db
			.query('site')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()
	},
})
