import { query } from './_generated/server'
import { getUser } from './auth'

export const getCompanies = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		return await ctx.db
			.query('company')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()
	},
})
