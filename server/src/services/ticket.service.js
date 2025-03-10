// src/services/ticket.service.js
import pkg from "pg";
const { Pool } = pkg;
import { config } from "../../db.js";

const pool = new Pool(config);

export class TicketService {
    async createTicket(ticketData) {
        const { title, description, priority, category, client_id, attachments } = ticketData;
    
        const query = `
          INSERT INTO tickets (title, description, priority, category, client_id, attachments)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb)
          RETURNING *;
        `;
        const values = [
          title,
          description,
          priority,
          category,
          client_id,
          JSON.stringify(attachments || []) // Преобразуем массив в JSON
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
      }

  async getTickets(filters) {
    const queryParams = [];
    let queryString = `
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.created_at, 
        t.updated_at, 
        t.priority, 
        t.category, 
        t.attachments,
        s.name as status
      FROM tickets t
      JOIN statuses s ON t.status_id = s.id
      WHERE t.client_id = $1
    `;

    queryParams.push(filters.clientId);

    if (filters.status) {
      queryString += ` AND s.id = $${queryParams.length + 1}`;
      queryParams.push(filters.status);
    }

    if (filters.priority) {
      queryString += ` AND t.priority = $${queryParams.length + 1}`;
      queryParams.push(filters.priority);
    }

    queryString += " ORDER BY t.created_at DESC";

    const { rows } = await pool.query(queryString, queryParams);
    return rows;
  }

  async getTicketById(ticketId, clientId) {
    const { rows } = await pool.query(
      `SELECT 
        t.*, 
        s.name as status,
        u.username as client_name
      FROM tickets t
      JOIN statuses s ON t.status_id = s.id
      JOIN users u ON t.client_id = u.id
      WHERE t.id = $1 AND t.client_id = $2`,
      [ticketId, clientId]
    );
    return rows[0];
  }
}