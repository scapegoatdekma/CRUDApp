import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import axios from "axios";
import Layout from "../../Layout/Layout";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Radar, Line, Doughnut, Bar } from 'react-chartjs-2';
import Modal from 'react-modal';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement
} from 'chart.js';

Modal.setAppElement('#root');

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement
);

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, API_URL } = useContext(AuthContext);
  const [isSiderActive, setIsSiderActive] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeChart, setActiveChart] = useState('skills');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showMeme, setShowMeme] = useState(false);
  const videoRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);
  const chartRef = useRef(null);

  // Скрытая кнопка будет активироваться после 5 кликов на аватар
  const handleAvatarClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowMeme(true);
        return 0;
      }
      return newCount;
    });
  };

  const closeModal = () => {
    setShowMeme(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const skillsData = [
    { name: 'JavaScript', proficiency: 85 },
    { name: 'React', proficiency: 90 },
    { name: 'UI/UX', proficiency: 75 },
    { name: 'Коммуникация', proficiency: 80 },
    { name: 'Управление', proficiency: 70 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(userResponse.data);
        setUserData(userResponse.data.user);

        const messagesResponse = await axios.get(`${API_URL}/api/messages`);
        console.log(messagesResponse);
        setMessages(messagesResponse.data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError(err.response?.data?.error || "Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Анализ активности в чате
  const analyzeChatActivity = () => {
    if (!messages.length) return {};
    
    // Группировка сообщений по пользователям
    const userActivity = {};
    
    messages.forEach(message => {
      if (!userActivity[message.username]) {
        userActivity[message.username] = {
          count: 0,
          lastActivity: null,
          days: {}
        };
      }
      
      const date = new Date(message.created_at).toLocaleDateString();
      userActivity[message.username].count++;
      
      if (!userActivity[message.username].days[date]) {
        userActivity[message.username].days[date] = 0;
      }
      userActivity[message.username].days[date]++;
      
      if (!userActivity[message.username].lastActivity || 
          new Date(message.created_at) > new Date(userActivity[message.username].lastActivity)) {
        userActivity[message.username].lastActivity = message.created_at;
      }
    });
    
    return userActivity;
  };

  const chatActivity = analyzeChatActivity();
  const userActivityData = chatActivity[userData?.username] || { count: 0, days: {} };

  // Подготовка данных для графиков активности
  const prepareActivityData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const activityCounts = last7Days.map(day => userActivityData.days[day] || 0);

    return {
      labels: last7Days.map(date => date.split('/').slice(0, 2).join('/')),
      data: activityCounts
    };
  };

  const activityData = prepareActivityData();

  const createGradient = (ctx, color) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(119, 82, 254, 0.1)');
    return gradient;
  };

  if (loading) return <div className="loading">Загрузка...</div>;
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
      <div className="profile">
        {userData && (
          <>
            <div className="profile-header">
              <img 
                src={userData.avatar} 
                alt="Аватар" 
                className="avatar"
                onClick={handleAvatarClick}
                style={{ cursor: 'pointer' }}
              />
              <div className="header-info">
                <h2>{userData.username}</h2>
                <p className="position">{userData.position || 'Сотрудник'}</p>
                <div className="rating">
                  <span>Сообщений: {userActivityData.count}</span>
                  <span>Рейтинг: {userData.rating || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-content">
              <div className="profile-grid">
                <div className="profile-section basic-info">
                  <h3>Основная информация</h3>
                  <div className="info-item">
                    <span>Email:</span>
                    <span>{userData.email}</span>
                  </div>
                  <div className="info-item">
                    <span>Роль:</span>
                    <span>{userData.role}</span>
                  </div>
                  <div className="info-item">
                    <span>Дата регистрации:</span>
                    <span>{new Date(userData.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span>Последняя активность:</span>
                    <span>
                      {userActivityData.lastActivity 
                        ? new Date(userActivityData.lastActivity).toLocaleString() 
                        : 'Нет данных'}
                    </span>
                  </div>
                </div>

                <div className="profile-section">
                  <div className="chart-tabs">
                    <div 
                      className={`tab ${activeChart === 'skills' ? 'active' : ''}`}
                      onClick={() => setActiveChart('skills')}
                    >
                      Навыки
                    </div>
                    <div 
                      className={`tab ${activeChart === 'activity' ? 'active' : ''}`}
                      onClick={() => setActiveChart('activity')}
                    >
                      Активность
                    </div>
                    <div 
                      className={`tab ${activeChart === 'competencies' ? 'active' : ''}`}
                      onClick={() => setActiveChart('competencies')}
                    >
                      Компетенции
                    </div>
                  </div>
                  
                  <div className="chart-container">
                    {activeChart === 'skills' && (
                      <div className="chart-wrapper">
                        <Doughnut 
                          data={{
                            labels: skillsData.map(skill => skill.name),
                            datasets: [{
                              data: skillsData.map(skill => skill.proficiency),
                              backgroundColor: [
                                '#7752FE80',
                                '#4CAF5080',
                                '#2196F380',
                                '#FF980080',
                                '#9C27B080'
                              ],
                              borderColor: [
                                '#7752FE',
                                '#4CAF50',
                                '#2196F3',
                                '#FF9800',
                                '#9C27B0'
                              ],
                              borderWidth: 2
                            }]
                          }}
                          options={{
                            cutout: '65%',
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right',
                                labels: {
                                  color: '#D1D1D1',
                                  font: {
                                    family: 'Montserrat'
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}

                    {activeChart === 'activity' && (
                      <div className="chart-wrapper">
                        <Bar 
                          data={{
                            labels: activityData.labels,
                            datasets: [{
                              label: 'Сообщений за день',
                              data: activityData.data,
                              backgroundColor: (context) => {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;
                                if (!chartArea) return null;
                                return createGradient(ctx, '#7752FE');
                              },
                              borderColor: '#7752FE',
                              borderWidth: 1,
                              borderRadius: 4
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return `Сообщений: ${context.raw}`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                  color: '#D1D1D1',
                                  stepSize: 1
                                }
                              },
                              x: {
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                  color: '#D1D1D1'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}

                    {activeChart === 'competencies' && (
                      <div className="chart-wrapper">
                        <Radar 
                          data={{
                            labels: ['Технические', 'Коммуникация', 'Лидерство', 'Креативность', 'Организация'],
                            datasets: [{
                              label: 'Компетенции',
                              data: [8, 7, 6, 9, 7],
                              backgroundColor: 'rgba(119, 82, 254, 0.2)',
                              borderColor: '#7752FE',
                              pointBackgroundColor: '#7752FE',
                              pointBorderColor: '#fff',
                              pointHoverRadius: 5,
                              pointRadius: 4,
                              borderWidth: 2
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              r: {
                                angleLines: {
                                  color: 'rgba(255, 255, 255, 0.1)',
                                  lineWidth: 1
                                },
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.1)',
                                  circular: true
                                },
                                pointLabels: {
                                  color: '#D1D1D1',
                                  font: {
                                    family: 'Montserrat',
                                    size: 12
                                  },
                                  padding: 15
                                },
                                suggestedMin: 0,
                                suggestedMax: 10,
                                ticks: {
                                  display: false,
                                  beginAtZero: true,
                                  stepSize: 2
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                enabled: true,
                                callbacks: {
                                  label: function(context) {
                                    return `${context.dataset.label}: ${context.raw}/10`;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
              )}
              
              <Modal
          isOpen={showMeme}
          onRequestClose={closeModal}
          contentLabel="Мемная пасхалка"
          className="meme-modal"
          overlayClassName="meme-overlay"
        >
          <div className="meme-container">
            <video 
              ref={videoRef}
              src="/videos/meme.mp4" 
              autoPlay 
              onEnded={closeModal}
              style={{ width: '100%', height: 'auto' }}
            />
            {/* <button onClick={closeModal} className="close-meme-btn">
              ×
            </button> */}
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

export default Profile;