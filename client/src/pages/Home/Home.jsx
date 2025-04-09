import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import {
  faTachometer,
  faDownload,
  faUpload,
  faCheck,
  faChartPie,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "../../Layout/Layout";
import { Pie, Line } from 'react-chartjs-2';
import { AuthContext } from "../../context/AuthContext/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const STATUS_MAP = {
  1: 'Новая',
  2: 'В обработке',
  3: 'Выполнена',
  4: 'Отменена'
};

function Home() {
  const navigate = useNavigate();
  const { logout, API_URL } = useContext(AuthContext); 
  const [isSiderActive, setIsSiderActive] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tickets`);
        setTickets(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getTicketCount = (statusId) => 
    tickets.filter(t => t.status === statusId).length;
  console.log(tickets);


  const chartData = {
    pie: {
      labels: Object.values(STATUS_MAP),
      datasets: [{
        data: Object.keys(STATUS_MAP).map(statusId => 
          getTicketCount(Number(statusId)))
        ,
        backgroundColor: ['#4CAF5080', '#2196F380', '#9C27B080', '#F4433680'],
        borderColor: ['#4CAF50', '#2196F3', '#9C27B0', '#F44336'],
      }]
    },
    line: {
      labels: [...new Set(tickets.map(t => 
        new Date(t.created_at).toLocaleDateString('ru-RU'))
      )].sort(),
      datasets: [{
        label: 'Активность заявок',
        data: tickets.reduce((acc, ticket) => {
          const date = new Date(ticket.created_at).toLocaleDateString('ru-RU');
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}),
        borderColor: '#2196F3',
        tension: 0.4
      }]
    }
  };

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <Layout 
      isSiderActive={isSiderActive} 
      toggleSider={() => setIsSiderActive(!isSiderActive)} 
      handleLogout={() => {
        logout();
        navigate("/auth");
      }}
    >
      <div className="dashboard">
        <section className="title-section">
          <div className="title">
            <FontAwesomeIcon icon={faTachometer} />
            <h2>Dashboard</h2>
          </div>
          <p className="subtitle">Актуальная статистика заявок</p>
        </section>

        <section className="card-section">
          <div className="card-element">
            <div className="content">
              <FontAwesomeIcon icon={faDownload} />
              <div className="counter">{getTicketCount(1)}</div>
              <div className="title">Входящие заявки</div>
            </div>
            <Link to="/tickets/new" className="goto">
              Перейти
            </Link>
          </div>
          <div className="card-element">
            <div className="content">
              <FontAwesomeIcon icon={faChartPie} />
              <div className="counter">{getTicketCount(2)}</div>
              <div className="title">В обработке</div>
            </div>
            <Link to="/tickets/in-progress" className="goto">
              Перейти
            </Link>
          </div>
          <div className="card-element">
            <div className="content">
              <FontAwesomeIcon icon={faCheck} />
              <div className="counter">{getTicketCount(3)}</div>
              <div className="title">Выполненные</div>
            </div>
            <Link to="/tickets/completed" className="goto">
              Перейти
            </Link>
          </div>
          <div className="card-element">
            <div className="content">
              <FontAwesomeIcon icon={faUpload} />
              <div className="counter">{getTicketCount(4)}</div>
              <div className="title">Архив</div>
            </div>
            <Link to="/tickets/archive" className="goto">
              Перейти
            </Link>
          </div>
        </section>

        <section className="charts-section">
          <div className="chart-card">
            <h3><FontAwesomeIcon icon={faChartPie} /> Распределение заявок</h3>
            <div className="chart-container">
              <Pie className="pie-chart" data={chartData.pie} />
            </div>
          </div>
          <div className="chart-card">
            <h3><FontAwesomeIcon icon={faChartLine} /> Динамика активности</h3>
            <div className="chart-container">
              <Line 
                data={chartData.line} 
                options={{ 
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    } 
                  }
                }} 
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;