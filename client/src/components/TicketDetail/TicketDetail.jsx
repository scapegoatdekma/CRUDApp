// src/components/TicketDetail/TicketDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/api/tickets/${id}`);
        setTicket(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <p>Приоритет: {ticket.priority}</p>
      <p>Категория: {ticket.category}</p>
      <p>Статус: {ticket.status}</p>
      <p>Дата создания: {new Date(ticket.created_at).toLocaleDateString()}</p>
      <h2>Вложения:</h2>
      <ul>
        {ticket.attachments.map((attachment, index) => (
          <li key={index}>
            <a href={attachment.path} target="_blank" rel="noopener noreferrer">{attachment.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketDetail;