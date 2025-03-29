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
      JSON.stringify(attachments || []), // Преобразуем массив в JSON
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
        t.status_id as status
      FROM tickets t
    `;

    if (filters.clientId) {
      queryString += ` WHERE t.client_id = $1`;
      queryParams.push(filters.clientId);
    }
   
    if (filters.status) {
      queryString += ` AND t.status_id = $${queryParams.length + 1}`;
      queryParams.push(filters.status);
    }

    if (filters.priority) {
      queryString += ` AND t.priority = $${queryParams.length + 1}`;
      queryParams.push(filters.priority);
    }

    queryString += " ORDER BY t.created_at DESC";

    const { rows } = await pool.query(queryString, queryParams);
    console.log(queryString);
    console.log(filters);
    console.log(rows);
    return rows;
  }

  async getTicketById(ticketId, clientId) {
    const { rows } = await pool.query(
      `SELECT 
        t.*
      FROM tickets t
      WHERE t.id = $1 AND t.client_id = $2`,
      [ticketId, clientId]
    );
    return rows[0];
  }

  async updateTicket(ticketId, ticketData) {
    const { title, description, priority, category, status_id, attachments } = ticketData;
    const query = `
      UPDATE tickets
      SET 
        title = $1,
        description = $2,
        priority = $3,
        category = $4,
        status_id = $5,
        attachments = $6::jsonb,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      title,
      description,
      priority,
      category,
      status_id,
      JSON.stringify(attachments || []),
      ticketId,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async deleteTicket(ticketId) {
    const { rows } = await pool.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [ticketId]
    );
    return rows[0];
  }
}