import { mutation, query } from './_generated/server'
import { getUser } from './auth'
import { companySchema } from './schema'

export const getCompanies = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		return await ctx.db
			.query('company')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()
	},
})

export const addCompany = mutation({
	args: companySchema.omit('userId'),
	async handler(ctx, args) {
		const user = await getUser(ctx)
		const userId = user._id
		return await ctx.db.insert('company', { ...args, userId })
	},
})
