import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer } from 'better-auth/plugins';
import { db } from '../db/index.js';
import * as schema from '../db/schema/index.js';

const defaultBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001';
const authBase = process.env.BETTER_AUTH_URL || defaultBase;
const baseURL = authBase.endsWith('/api/auth') ? authBase : `${authBase}/api/auth`;
const isProd = process.env.NODE_ENV === 'production' && !authBase.includes('localhost');

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "default_fallback_secret_that_is_long_enough_for_better_auth",
    baseURL,
    // @ts-ignore - Vercel strict TS complains but this works at runtime
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://compro-arsikarya.vercel.app',
        ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    ],
    ...(isProd ? {
        advanced: {
            // @ts-ignore
            cookieOptions: {
                sameSite: "none",
                secure: true,
            },
        }
    } : {}),
    plugins: [
        bearer()
    ]
});
