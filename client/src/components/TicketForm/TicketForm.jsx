// components/TicketCreateSection/TicketForm.jsx
import { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TicketForm.scss';
import { AuthContext } from '../../context/AuthContext/AuthContext';

// Соответствие приоритетов значениям в БД
const PRIORITY_MAP = {
  'Низкий': 1,
  'Средний': 2,
  'Высокий': 3
};

// Категории тикетов
const TICKET_CATEGORIES = [
  'Технические проблемы',
  'Финансовые вопросы',
  'Общие вопросы',
  'Хостинг',
  'Разработка',
  'Другое'
];

const TicketForm = () => {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Средний',
    category: 'Другое'
  });
  
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Введите заголовок';
    if (formData.title.length > 255) newErrors.title = 'Максимум 255 символов';
    if (!formData.description.trim()) newErrors.description = 'Введите описание';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик файлов
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

  // Удаление файла
  const removeFile = (id) => {
    setPreviews(previews.filter(file => file.id !== id));
    URL.revokeObjectURL(id);
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      console.log(currentUser);
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('priority', PRIORITY_MAP[formData.priority]);
      formPayload.append('category', formData.category);
      formPayload.append('creator_name', currentUser.username);
      formPayload.append('client_id', currentUser.user.id);

      // Добавление файлов
      previews.forEach((file, index) => {
        formPayload.append(`attachments[${index}]`, file.file);
      });

      const response = await axios.post('http://localhost:4200/api/tickets', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if(response.data.success) {
        setSubmitSuccess(true);
        resetForm();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Ошибка создания тикета:', error);
      setErrors({
        submit: error.response?.data?.message || 'Ошибка при создании тикета'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Средний',
      category: 'Другое'
    });
    setPreviews([]);
    setErrors({});
  };

  return (
    <div className="ticket-create">
      <h2 className="ticket-create__header">Создание новой заявки</h2>

      {/* Информация о пользователе */}
      <div className="user-info">
        <h3>{currentUser?.username || 'Гость'}</h3>
        <div className="info-grid">
          <div className="info-item">
            <span>Должность:</span>
            <span>{currentUser?.position || 'Не указано'}</span>
          </div>
          <div className="info-item">
            <span>Email:</span>
            <span>{currentUser?.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Форма заявки */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Категория:</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={errors.category ? 'error' : ''}
            >
              {TICKET_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Приоритет:</label>
            <div className="priority-buttons">
              {Object.keys(PRIORITY_MAP).map(priority => (
                <button
                  type="button"
                  key={priority}
                  className={`priority-btn ${formData.priority === priority ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, priority})}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Заголовок:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={errors.title ? 'error' : ''}
            maxLength={255}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Описание:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className={errors.description ? 'error' : ''}
            rows="5"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="file-upload">
          <div className="upload-header">
            <FontAwesomeIcon icon={faPaperclip} />
            <span>Прикрепить файлы:</span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              id="fileInput"
              accept="image/*,.pdf,.doc,.docx"
            />
            <label htmlFor="fileInput" className="file-label">
              Выбрать файлы
            </label>
          </div>
          
          <div className="file-previews">
            {previews.map(preview => (
              <div key={preview.id} className="file-item">
                <div className="file-info">
                {preview.type === 'image' && (
                    <img 
                      src={preview.id} 
                      alt="Preview" 
                      className="file-preview"
                    />
                  )}
                  <div className="">
                  <span className="file-name">{preview.name}</span>
                  <span className="file-size">{preview.size}</span>                 
                  </div>
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

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Отправка...
              </>
            ) : 'Создать заявку'}
          </button>
          
          <button 
            type="button"
            className="cancel-btn"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Очистить форму
          </button>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}

        {submitSuccess && (
          <div className="success-message">
            ✅ Заявка успешно создана! Номер: #{Math.random().toString().slice(2, 8)}
          </div>
        )}
      </form>
    </div>
  );
};

export default TicketForm;