// components/TicketCreateSection/TicketForm.jsx
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import './TicketForm.scss';

const TicketForm = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    priority: 'Средний',
    subject: 'Другое',
    description: ''
  });
  const safeUser = currentUser || {
    username: 'Гость',
    position: 'Не определено',
    email: 'N/A',
    login: 'dekmaOFF'
  };

  console.log(safeUser);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      id: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      file
    }));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (id) => {
    setPreviews(previews.filter(file => file.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Логика отправки формы и автоматического назначения
  };

  return (
    <div className="ticket-create">
       <h2 className="ticket-create__header">Создание новой заявки</h2>

{/* Информация о пользователе с optional chaining */}
<div className="user-info">
      <h3>{safeUser.username}</h3>
      <div className="info-grid">
        <div className="info-item">
          <span>Логин:</span>
          <span>{safeUser.login}</span>
        </div>
        <div className="info-item">
          <span>Должность:</span>
          <span>{safeUser.position}</span>
        </div>
        <div className="info-item">
          <span>E-mail:</span>
          <span>{safeUser.email}</span>
        </div>
      </div>
    </div>

      {/* Форма заявки */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Кому:</label>
            <select
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
            >
              <option value="Сектор хостинга">Сектор хостинга</option>
              {/* Дополнительные опции */}
            </select>
          </div>

          <div className="form-group">
            <label>Приоритет:</label>
            <div className="priority-buttons">
              {['Низкий', 'Средний', 'Высокий'].map(priority => (
                <button
                  type="button"
                  key={priority}
                  className={formData.priority === priority ? 'active' : ''}
                  onClick={() => setFormData({...formData, priority})}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Тема:</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            >
              <option value="Другое">Другое</option>
              {/* Дополнительные опции */}
            </select>
          </div>
        </div>

        {/* Текстовое поле */}
        <div className="form-group">
          <label>Текст:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="5"
          />
        </div>

        {/* Загрузка файлов */}
        <div className="file-upload">
          <div className="upload-header">
            <FontAwesomeIcon icon={faPaperclip} />
            <span>Добавить файл:</span>
          </div>
          
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            id="fileInput"
          />
          
          <div className="file-previews">
            {previews.map(preview => (
              <div key={preview.id} className="file-item">
                <div className="file-info">
                  <span className="file-name">{preview.name}</span>
                  <span className="file-size">{preview.size}</span>
                </div>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFile(preview.id)}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Создать заявку
          </button>
          <button type="button" className="cancel-btn">
            Очистить поля
          </button>
        </div>
      </form>
    </div>
  );
};
export default TicketForm;