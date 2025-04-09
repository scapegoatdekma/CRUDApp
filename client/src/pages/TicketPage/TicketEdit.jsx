import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout/Layout";
import { STATUS_MAP, PRIORITY_MAP } from "../../constants/ticketConstants";
import "./TicketPage.scss";

const TicketEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: 2,
    status_id: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:4200/api/tickets/${id}`);
        setTicket(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4200/api/tickets/${id}`, ticket);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <Layout>
      <div className="ticket-edit">
        <div className="page-header">
          <h1>Редактирование заявки #{id}</h1>
          <div className="controls">
            <button 
              onClick={() => navigate(`/tickets/${id}`)}
              className="back-button"
            >
              ← Отмена
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Заголовок</label>
            <input
              type="text"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={ticket.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <input
              type="text"
              name="category"
              value={ticket.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Приоритет</label>
            <div className="select-wrapper">
                <select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
                className="priority-select"
                >
                {Object.entries(PRIORITY_MAP).map(([value, { text, color }]) => (
                    <option 
                    key={value} 
                    value={value}
                    style={{ backgroundColor: color }}
                    >
                    {text}
                    </option>
                ))}
                </select>
            </div>
            </div>

            <div className="form-group">
            <label>Статус</label>
            <div className="select-wrapper">
                <select
                name="status_id"
                value={ticket.status_id}
                onChange={handleChange}
                className="status-select"
                >
                {Object.entries(STATUS_MAP).map(([value, { text, color }]) => (
                    <option 
                    key={value} 
                    value={value}
                    style={{ backgroundColor: color }}
                    >
                    {text}
                    </option>
                ))}
                </select>
            </div>
            </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default TicketEdit;