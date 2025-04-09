import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout/Layout";
import { STATUS_MAP, PRIORITY_MAP } from "../../constants/ticketConstants"; // Добавлен импорт
import "./TicketPage.scss";

function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:4200/api/tickets");
        setTickets(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4200/api/tickets/${id}`);
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении тикета:", error);
    }
  };

  return (
    <Layout>
      <div className="ticket-page">
        <div className="page-header">
          <h1>Управление заявками</h1>
          <Link to="/ticket/create" className="create-button">
            + Новая заявка
          </Link>
        </div>

        {loading && <div className="loading">Загрузка...</div>}
        {error && <div className="error">Ошибка: {error}</div>}

        {!loading && !error && (
          <div className="tickets-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Заголовок</th>
                  <th>Категория</th>
                  <th>Приоритет</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Link to={`/tickets/${ticket.id}`} className="ticket-link">
                        #{ticket.id}
                      </Link>
                    </td>
                    <td>{ticket.title}</td>
                    <td>{ticket.category || "Без категории"}</td>
                    <td>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: PRIORITY_MAP[ticket.priority]?.color }}
                      >
                        {PRIORITY_MAP[ticket.priority]?.text}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: STATUS_MAP[ticket.status_id]?.color }}
                      >
                        {STATUS_MAP[ticket.status_id]?.text}
                      </span>
                    </td>
                    <td>{new Date(ticket.created_at).toLocaleDateString("ru-RU")}</td>
                    <td className="actions">
                      <button 
                        onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                        className="edit-button"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        className="delete-button"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TicketPage;