import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getUser } from './auth'
import { employeeSchema } from './schema'

export const add_employee = mutation({
	args: employeeSchema,
	async handler(ctx, args) {
		return await ctx.db.insert('employee', args)
	},
})

export const getEmployees = query({
	async handler(ctx) {
		const user = await getUser(ctx)
		return await ctx.db
			.query('employee')
			.withIndex('by_userid', q => q.eq('userId', user._id))
			.collect()
	},
})

export const terminate_employee = mutation({
	args: {
		id: v.id('employee'),
	},
	async handler(ctx, args) {
		const employee = ctx.db.get('employee', args.id)
		return await ctx.db.patch('employee', args.id, {
			...employee,
			status: 'terminated',
		})
	},
})
