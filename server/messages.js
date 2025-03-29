import { pool } from './db.js';

export const getMessages = async () => {
  try {
    const res = await pool.query(`
      SELECT 
        messages.*, 
        users.avatar, 
        EXISTS(SELECT 1 FROM users WHERE id = messages.user_id AND role = 'admin') as is_admin,
        (messages.updated_at IS NOT NULL AND messages.updated_at != messages.created_at) as is_edited
      FROM messages
      LEFT JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC 
      LIMIT 50
    `);
    console.log('Messages loaded:', res.rows.length);
    return res.rows;
  } catch (error) {
    console.error('Error loading messages:', error);
    throw error;
  }
};

export const saveMessage = async (text, username, userId, attachments = null) => {
  try {
    console.log('Saving message with attachments:', attachments);

    // Проверяем и форматируем вложения
    const formattedAttachments = Array.isArray(attachments) 
      ? attachments
      : [];

    const res = await pool.query(
      `WITH inserted_message AS (
        INSERT INTO messages (text, username, user_id, attachments, created_at)
        VALUES ($1, $2, $3, $4::jsonb, CURRENT_TIMESTAMP)
        RETURNING *
      )
      SELECT 
        inserted_message.*, 
        users.avatar,
        EXISTS(SELECT 1 FROM users WHERE id = $3 AND role = 'admin') as is_admin
      FROM inserted_message
      LEFT JOIN users ON inserted_message.user_id = users.id`,
      [
        text, 
        username, 
        userId, 
        formattedAttachments.length > 0 ? formattedAttachments : null
      ]
    );

    const savedMessage = res.rows[0];
    console.log('Message saved:', savedMessage);
    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const updateMessage = async (id, text, userId, attachments = null) => {
  try {
    console.log('Updating message:', { id, text, attachments });

    const formattedAttachments = Array.isArray(attachments) 
      ? attachments
      : [];

    const res = await pool.query(
      `WITH updated_message AS (
        UPDATE messages 
        SET 
          text = $1,
          attachments = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND user_id = $4
        RETURNING *
      )
      SELECT 
        updated_message.*, 
        users.avatar,
        EXISTS(SELECT 1 FROM users WHERE id = $4 AND role = 'admin') as is_admin
      FROM updated_message
      LEFT JOIN users ON updated_message.user_id = users.id`,
      [
        text,
        formattedAttachments.length > 0 ? formattedAttachments : null,
        id,
        userId
      ]
    );

    if (res.rows.length === 0) {
      throw new Error('Message not found or permission denied');
    }

    const updatedMessage = res.rows[0];
    console.log('Message updated:', updatedMessage);
    return updatedMessage;
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (id, userId, isAdmin = false) => {
  try {
    const query = isAdmin 
      ? 'DELETE FROM messages WHERE id = $1 RETURNING *'
      : 'DELETE FROM messages WHERE id = $1 AND user_id = $2 RETURNING *';
    
    const values = isAdmin ? [id] : [id, userId];
    
    const res = await pool.query(query, values);
    
    if (res.rows.length === 0) {
      throw new Error('Message not found or permission denied');
    }

    console.log('Message deleted:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};