import { mutation, query } from './_generated/server'
import { getUser } from './auth'
import { shiftSchema } from './schema'

export const addShift = mutation({
	args: shiftSchema,
	async handler(ctx, args) {
		await getUser(ctx)
		return await ctx.db.insert('shift', args)
	},
})

export const getShifts = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		const sites = await ctx.db
			.query('site')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()

		return await Promise.all(
			sites.map(
				async site =>
					await ctx.db
						.query('shift')
						.withIndex('by_site', q => q.eq('site', site._id))
						.filter(q => q.eq(q.field('terminated'), false))
						.collect(),
			),
		)
	},
})
