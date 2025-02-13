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
        // Expecting a JSON payload with a videoid and a boolean flag (prop)
        const { videoid, prop } = await request.json();

        if (!videoid || typeof prop !== 'boolean') {
            return new Response(
                JSON.stringify({ error: "videoid and prop (boolean) are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Determine the increment based on the prop: true increases, false decreases
        const increment = prop ? 50 : -50;

        const client = await pool.connect();
        try {
            // Update the weight of the provided videoid
            const updateQuery = `
				UPDATE memes
				SET weight = weight + $1
				WHERE videoid = $2
				RETURNING weight
			`;
            const result = await client.query(updateQuery, [increment, videoid]);

            if (result.rowCount === 0) {
                return new Response(
                    JSON.stringify({ error: "Video not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            // Return the new weight
            return new Response(JSON.stringify(result.rows[0]), {
                headers: { "Content-Type": "application/json" }
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error updating weight:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
