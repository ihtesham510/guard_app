import { config } from 'dotenv'

config({ path: ['../../.env.local', '../../.env'] })

Bun.write(
	'./.env.local',
	`CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n CONVEX_URL='${process.env.CONVEX_URL}'\n CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
)
