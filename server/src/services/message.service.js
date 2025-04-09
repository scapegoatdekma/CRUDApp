import pkg from "pg";
const { Pool } = pkg;
import { config } from "../../db.js";

const pool = new Pool(config);

export class MessageService {

    static async getMessages() {
        const query = `
            SELECT 
                m.id, m.text, m.created_at, m.updated_at, m.attachments,
                u.username, u.id as user_id
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}