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
        const { videoLink, rarity } = await request.json();

        if (!videoLink || !rarity) {
            return new Response(
                JSON.stringify({ error: "videoLink and rarity are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await pool.connect();
        try {
            const query = `
        INSERT INTO memes (videoid, rarity)
        VALUES ($1, $2)
        RETURNING *
      `;
            const result = await client.query(query, [videoLink, rarity]);
            return new Response(JSON.stringify(result.rows[0]), {
                headers: { "Content-Type": "application/json" }
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error submitting meme:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
