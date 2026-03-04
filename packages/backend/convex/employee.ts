import { v } from 'convex/values'
import { mutation } from './_generated/server'
import { employeeSchema } from './schema'

export const add_employee = mutation({
	args: employeeSchema,
	async handler(ctx, args) {
		return await ctx.db.insert('employee', args)
	},
})
export const update_employee = mutation({
	args: { ...employeeSchema, id: v.id('employee') },
	async handler(ctx, { id, ...rest }) {
		return await ctx.db.patch('employee', id, rest)
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
