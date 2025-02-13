import { Pool } from 'postgres-pool';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

// Create a connection pool
const pool = new Pool({
    user: DB_USER ?? '',
    host: DB_HOST ?? '',
    database: DB_NAME ?? '',
    password: DB_PASSWORD ?? '',
    port: parseInt(DB_PORT ?? '', 10)
});

// Define the rarity ranges in 1000-step intervals
const rarityRanges: Record<string, { min: number; max: number }> = {
    common: { min: 0, max: 1000 },
    uncommon: { min: 1000, max: 2000 },
    rare: { min: 2000, max: 3000 },
    epic: { min: 3000, max: 4000 },
    legendary: { min: 4000, max: 5000 }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Extract rarity from the request body (expecting a string, e.g., "legendary")
        const { rarity } = await request.json();

        if (!rarity) {
            return new Response(
                JSON.stringify({ error: "Rarity is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Convert rarity to lowercase to match our mapping
        const rarityKey = rarity.toLowerCase();
        const range = rarityRanges[rarityKey];

        if (!range) {
            return new Response(
                JSON.stringify({ error: "Invalid rarity provided" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await pool.connect();

        try {
            // Query to get a random videoid with a weight within the specified range
            const videoQuery = `
                SELECT videoid, source 
                FROM memes 
                WHERE weight >= $1 AND weight < $2 AND source = 'IG'
                ORDER BY RANDOM()
                LIMIT 1
            `;
            const videoResult = await client.query(videoQuery, [range.min, range.max]);

            if (videoResult.rowCount === 0) {
                return new Response(
                    JSON.stringify({ error: "No video found for this rarity" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            return new Response(JSON.stringify(videoResult.rows[0]), {
                headers: { "Content-Type": "application/json" }
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error fetching video:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
