import { Pool } from 'postgres-pool';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

const pool = new Pool({
    user: DB_USER ?? '',
    host: DB_HOST ?? '',
    database: DB_NAME ?? '',
    password: DB_PASSWORD ?? '',
    port: parseInt(DB_PORT ?? '', 10)
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Extract rarity from the request body
        const { rarity } = await request.json();

        if (!rarity) {
            return new Response(
                JSON.stringify({ error: "Rarity is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await pool.connect();
        try {
            // Query to get a random videoid by rarity
            const videoQuery = `
				SELECT videoid 
				FROM memes 
				WHERE rarity = $1
				ORDER BY RANDOM()
				LIMIT 1
			`;
            const videoResult = await client.query(videoQuery, [rarity]);

            if (videoResult.rowCount === 0) {
                return new Response(
                    JSON.stringify({ error: "No video found for this rarity" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            return new Response(JSON.stringify(videoResult.rows[0]), {
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            await client.release();
        }
    } catch (err) {
        console.error("Error fetching video:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
