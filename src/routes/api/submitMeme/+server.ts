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

// Map rarity names to a default weight value (for example, the midpoint of the range)
const rarityToWeight: Record<string, number> = {
    common: 500,       // between 0 and 1000
    uncommon: 1500,    // between 1000 and 2000
    rare: 2500,        // between 2000 and 3000
    epic: 3500,        // between 3000 and 4000
    legendary: 4500    // between 4000 and 5000
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { videoLink, rarity, source } = await request.json();

        if (!videoLink || !rarity || !source) {
            return new Response(
                JSON.stringify({ error: "videoLink, rarity, and source are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Convert the provided rarity to lowercase and map it to a weight.
        const rarityKey = rarity.toLowerCase();
        const weight = rarityToWeight[rarityKey];
        if (weight === undefined) {
            return new Response(
                JSON.stringify({ error: "Invalid rarity provided" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO memes (videoid, weight, source)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await client.query(query, [videoLink, weight, source]);
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
