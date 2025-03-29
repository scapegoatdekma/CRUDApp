// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout/Layout";
import "./TicketPage.scss";

function TicketPage() {
    const [isSiderActive, setIsSiderActive] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const toggleSider = () => {
      setIsSiderActive(!isSiderActive);
    };
  
    const handleLogout = () => {
      logout(); // Вызываем функцию logout
      navigate("/auth");
    };
  
    // Функция для преобразования приоритета в текст
    const getPriorityText = (priority) => {
      switch (priority) {
        case 1:
          return "Низкий";
        case 2:
          return "Средний";
        case 3:
          return "Высокий";
        default:
          return "Неизвестно";
      }
    };
  
    // Функция для преобразования статуса в текст
    const getStatusText = (status) => {
      switch (status) {
        case 1:
          return "Открыт";
        case 2:
          return "В процессе";
        case 3:
          return "Решён";
        case 4:
          return "Закрыт";
        default:
          return "Неизвестно";
      }
    };
  
    useEffect(() => {
      const fetchTickets = async () => {
        try {
          console.log("test");
          const response = await axios.get("http://localhost:4200/api/tickets");
          setTickets(response.data);
          console.log(response);
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
      <Layout isSiderActive={isSiderActive} toggleSider={toggleSider} handleLogout={handleLogout}>
        {loading && <div>Загрузка...</div>}
        {error && <div>Ошибка: {error}</div>}
        {!loading && (
          <div className="ticket-list">
            <h1>Список тикетов</h1>
            <Link to="/ticket_create" className="btn-primary">
              Создать новый тикет
            </Link>
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
                      <Link to={`/tickets/${ticket.id}`}>{ticket.id}</Link>
                    </td>
                    <td>{ticket.title}</td>
                    <td>{ticket.category}</td>
                    <td>{getPriorityText(ticket.priority)}</td> {/* Преобразуем приоритет */}
                    <td>{getStatusText(ticket.status)}</td> {/* Преобразуем статус */}
                    <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>
                        Редактировать
                      </button>
                      <button onClick={() => handleDelete(ticket.id)}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
    );
  }
  
  export default TicketPage;