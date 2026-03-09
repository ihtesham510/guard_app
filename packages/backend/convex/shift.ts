import { mutation } from './_generated/server'
import { getUser } from './auth'
import { shiftSchema } from './schema'

export const addShift = mutation({
	args: shiftSchema,
	async handler(ctx, args) {
		await getUser(ctx)
		return await ctx.db.insert('shift', args)
	},
})
