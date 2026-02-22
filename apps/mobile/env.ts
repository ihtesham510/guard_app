import { config } from 'dotenv'

config({ path: ['../../.env.local', '../../.env'] })

Bun.write(
	'./.env.local',
	`EXPO_PUBLIC_CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n EXPO_PUBLIC_CONVEX_URL='${process.env.CONVEX_URL}'\n EXPO_PUBLIC_CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
)
