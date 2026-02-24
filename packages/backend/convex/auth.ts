import { expo } from '@better-auth/expo'
import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth/minimal'
import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import { query } from './_generated/server'
import authConfig from './auth.config'

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	const siteUrl = process.env.SITE_URL!
	return betterAuth({
		trustedOrigins: ['exp://', 'http://localhost:3000/'],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [crossDomain({ siteUrl }), expo(), convex({ authConfig })],
	})
}
export const getCurrentUser = query({
	args: {},
	handler: async ctx => {
		return authComponent.getAuthUser(ctx)
	},
})
