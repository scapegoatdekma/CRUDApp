import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout/Layout";
import { STATUS_MAP, PRIORITY_MAP } from "../../constants/ticketConstants"; // Добавлен импорт
import "./TicketPage.scss";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tickets/${id}`);
        setTicket(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/tickets/${id}`);
      navigate("/tickets");
    } catch (error) {
      console.error("Ошибка при удалении тикета:", error);
    }
  };

  console.log(ticket);
  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;


  const isImage = (fileType) => {
    return fileType.startsWith('image/');
  };

  return (
    <Layout>
      <div className="ticket-details">
        <div className="page-header">
          <h1>Заявка #{ticket.id}</h1>
          <div className="controls">
            <Link to="/tickets" className="back-button">
              ← Назад
            </Link>
            <button 
              onClick={() => navigate(`/tickets/${id}/edit`)}
              className="edit-button"
            >
              Редактировать
            </button>
            <button onClick={handleDelete} className="delete-button">
              Удалить
            </button>
          </div>
        </div>

        <div className="ticket-content">
          <div className="main-info">
            <h2>{ticket.title}</h2>
            <p className="description">{ticket.description}</p>
            
            <div className="meta-info">
              <div className="status">
                <span>Статус:</span>
                <span className="status-badge" style={{ 
                  backgroundColor: STATUS_MAP[ticket.status_id]?.color 
                }}>
                  {STATUS_MAP[ticket.status_id]?.text}
                </span>
              </div>
              <div className="priority">
                <span>Приоритет:</span>
                <span className="priority-badge" style={{ 
                  backgroundColor: PRIORITY_MAP[ticket.priority]?.color 
                }}>
                  {PRIORITY_MAP[ticket.priority]?.text}
                </span>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <div className="info-block">
              <h3>Детали</h3>
              <p><span>Категория:</span> {ticket.category || "Не указана"}</p>
              <p><span>Дата создания:</span> 
                {new Date(ticket.created_at).toLocaleDateString("ru-RU")}
              </p>
              <p><span>Последнее обновление:</span> 
                {new Date(ticket.updated_at).toLocaleDateString("ru-RU")}
              </p>
            </div>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="attachments">
                <h3>Вложения</h3>
                <div className="files">
                  {ticket.attachments.map((file, index) => (
                    <a 
                      key={index} 
                      href={file.path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      📎 {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {ticket.attachments && ticket.attachments.length > 0 && (
  <div className="attachments">
    <h3>Вложения</h3>
    <div className="files-grid">
      {ticket.attachments.map((file, index) => (
        <div key={index} className="file-item">
          {isImage(file.type) ? (
            <div className="image-preview">
              <a 
                href={`${API_URL}${file.path}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={`${API_URL}${file.path}`}
                  alt={file.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    // Можно также показать fallback:
                    // e.target.src = '/path-to-default-image.png';
                  }}
                />
              </a>
              <span className="file-name">{file.name}</span>
            </div>
          ) : (
            <a 
              href={`${API_URL}${file.path}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="file-link"
            >
              📎 {file.name} ({file.type})
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </Layout>
  );
};

export default TicketDetails;