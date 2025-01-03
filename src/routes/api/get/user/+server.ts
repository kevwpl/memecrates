import { Pool } from 'postgres-pool';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import type { User, Session } from "$lib/types";
import { createHash, randomBytes } from 'crypto';

const pool = new Pool({
    user: DB_USER ?? '',
    host: DB_HOST ?? '',
    database: DB_NAME ?? '',
    password: DB_PASSWORD ?? '',
    port: parseInt(DB_PORT ?? '', 10)
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password, perma } = await request.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const client = await pool.connect();
        try {
            // Löschen aller abgelaufenen Sitzungen
            const deleteExpiredSessionsQuery = `
                DELETE FROM session WHERE expires < NOW()
            `;
            await client.query(deleteExpiredSessionsQuery);

            // Benutzer anhand der E-Mail suchen
            const userQuery = 'SELECT * FROM users WHERE email = $1';
            const userResult = await client.query(userQuery, [email]);

            if (userResult.rows.length === 0) {
                return new Response(
                    JSON.stringify({ error: 'login.notfound' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const user: User = userResult.rows[0];

            const hashedPassword = getSHA256Hash(password);
            if (hashedPassword !== user.password) {
                return new Response(
                    JSON.stringify({ error: 'login.notfound' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Sitzungsdaten generieren
            const sessionToken = generateSessionToken();
            const expires = new Date();
            expires.setDate(expires.getDate() + (perma ? 365 : 7)); // Ablaufdatum (7 Tage oder 365 Tage bei "perma")

            const session: Session = {
                uuid: '',
                useruuid: user.uuid,
                token: sessionToken,
                expires,
                perma: !!perma
            };

            // Neue Sitzung in der Datenbank speichern
            const sessionQuery = `
                INSERT INTO session (useruuid, token, expires, perma)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(sessionQuery, [
                session.useruuid,
                session.token,
                session.expires.toISOString(),
                session.perma
            ]);

            // Rückgabe von Benutzer und Sitzung (ohne Passwort)
            const { password: _, ...userWithoutPassword } = user;

            return new Response(JSON.stringify({
                user: userWithoutPassword,
                session: {
                    token: session.token,
                    expires: session.expires
                }
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } finally {
            await client.release();
        }
    } catch (err) {
        console.error('Error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

function getSHA256Hash(input: string): string {
    const hash = createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}

function generateSessionToken(): string {
    return randomBytes(32).toString('hex');
}