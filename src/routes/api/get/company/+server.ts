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
        // Extract session token from the request body
        const { sessionToken } = await request.json();

        if (!sessionToken) {
            return new Response(
                JSON.stringify({ error: "Session token is required" }),
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

            const session = sessionResult.rows[0];
            if (new Date(session.expires) < new Date()) {
                return new Response(
                    JSON.stringify({ error: "Session expired" }),
                    { status: 401, headers: { "Content-Type": "application/json" } }
                );
            }

            // Fetch user details based on the session's useruuid
            const userQuery = `
                SELECT companies
                FROM users
                WHERE uuid = $1
            `;
            const userResult = await client.query(userQuery, [session.useruuid]);

            if (userResult.rows.length === 0) {
                return new Response(
                    JSON.stringify({ error: "User not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
            const companyUUIDs = userResult.rows[0].companies;

            if (!Array.isArray(companyUUIDs) || companyUUIDs.length === 0) {
                return new Response(JSON.stringify([]), {
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Fetch companies the user has access to
            const companyQuery = `
                SELECT *
                FROM company
                WHERE uuid = ANY($1::uuid[])
            `;
            const companyResult = await client.query(companyQuery, [companyUUIDs]);

            return new Response(JSON.stringify(companyResult.rows), {
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            await client.release();
        }
    } catch (err) {
        console.error("Error fetching companies:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
