import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	// Only load .env variable if in development, essentially
	dotenv.config({ path: '.env.debug' });
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'node prisma/index_seed.js',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
});
