import { Pool } from 'postgres-pool';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import type {Service} from "$lib/types";

const pool = new Pool({
    user: DB_USER ?? '',
    host: DB_HOST ?? '',
    database: DB_NAME ?? '',
    password: DB_PASSWORD ?? '',
    port: parseInt(DB_PORT ?? '', 10)
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Extract session token and company from the request body
        const { sessionToken, company } = await request.json();

        if (!sessionToken) {
            return new Response(
                JSON.stringify({ error: "Session token is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!company) {
            return new Response(
                JSON.stringify({ error: "Company is required" }),
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

            // Fetch services associated with the specified company
            const servicesQuery = `
                SELECT uuid, name, price, company, bookings
                FROM service
                WHERE company = $1
            `;
            const servicesResult = await client.query(servicesQuery, [company]);

            const services: Service[] = servicesResult.rows;

            return new Response(JSON.stringify(services), {
                headers: { "Content-Type": "application/json" },
            });
        } finally {
            await client.release();
        }
    } catch (err) {
        console.error("Error fetching services:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
