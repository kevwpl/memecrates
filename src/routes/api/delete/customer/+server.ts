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

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        // Extract fields from the request body
        const { sessionToken, customerId } = await request.json();

        // Validate required fields
        if (!sessionToken || !customerId) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await pool.connect();
        try {
            // Validate the session
            const sessionQuery = `
                SELECT useruuid, expires 
                FROM session 
                WHERE token = $1
            `;
            const sessionResult = await client.query(sessionQuery, [sessionToken]);

            if (sessionResult.rows.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Invalid or expired session" }),
                    { status: 401, headers: { "Content-Type": "application/json" } }
                );
            }
            // Delete the customer from the database
            const deleteQuery = `
                DELETE FROM customer
                WHERE uuid = $1
                RETURNING *
            `;
            const result = await client.query(deleteQuery, [customerId]);

            if (result.rows.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Customer not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            return new Response(JSON.stringify({ message: "Customer deleted successfully", customer: result.rows[0] }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            await client.release();
        }
    } catch (err) {
        console.error("Error deleting customer:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
