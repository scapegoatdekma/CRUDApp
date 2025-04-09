import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperPlane, 
  faUser, 
  faEllipsisVertical,
  faTrash,
  faEdit,
  faTimes,
  faImage,
  faFile
} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../Layout/Layout";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import "./ChatPage.scss";

const socket = io('http://192.168.1.119:4200', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

const ChatPage = () => {
  const [isSiderActive, setIsSiderActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, logout } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser.user.username);
  const [showMenu, setShowMenu] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const newAttachments = [];
    
    for (const file of files) {
      try {
        const type = file.type.split('/')[0];
        const previewUrl = URL.createObjectURL(file);
        
        newAttachments.push({
          name: file.name,
          type,
          url: previewUrl,
          file,
          size: file.size,
          mimeType: file.type
        });
      } catch (error) {
        console.error('Error creating preview:', error);
      }
    }
  
    setAttachments(previousAttachments => [...previousAttachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(previousAttachments => previousAttachments.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit('get_history');

    const handleHistory = (history) => {
      const validMessages = history.filter(message => 
        (message.text || message.attachments) && message.created_at && message.username
      );
      setMessages(validMessages.reverse());
      setTimeout(scrollToBottom, 100);
    };

    const handleNewMessage = (message) => {
      setMessages(previousMessages => [...previousMessages, message]);
      setTimeout(scrollToBottom, 100);
    };

    const handleDeleteMessage = (messageId) => {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    };

    const handleUpdateMessage = (updatedMessage) => {
      setMessages(previousMessages => previousMessages.map(message => 
        message.id === updatedMessage.id ? { ...message, ...updatedMessage } : message
      ));
    };

    socket.on('messages_history', handleHistory);
    socket.on('new_message', handleNewMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('message_updated', handleUpdateMessage);

    return () => {
      socket.off('messages_history', handleHistory);
      socket.off('new_message', handleNewMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('message_updated', handleUpdateMessage);
    };

  }, []);

  useEffect(() => {
    console.log(messages);

  }, [messages])

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Delete message?')) {
      socket.emit('delete_message', { 
        messageId,
        userId: currentUser.user.id,
        role: currentUser.user.role
      });
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.text);
    setAttachments(message.attachments || []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const uploadedAttachments = [];
      
      // Загрузка файлов, если есть
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach(attachment => {
          if (attachment.file) {
            formData.append('files', attachment.file);
          }
        });

        const uploadResponse = await fetch('http://192.168.1.119:4200/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!uploadResponse.ok) throw new Error('File upload failed');
        const result = await uploadResponse.json();
        uploadedAttachments.push(...result.files);
      }

      if (editingMessage) {
        socket.emit('update_message', {
          id: editingMessage.id,
          text: newMessage.trim(),
          userId: currentUser.user.id,
          attachments: uploadedAttachments
        });
        setEditingMessage(null);
      } else {
        socket.emit('new_message', {
          text: newMessage.trim(),
          username: username.trim(),
          user_id: currentUser.user.id,
          attachments: uploadedAttachments
        });
      }
      
      setNewMessage('');
      setAttachments([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Message send error:', error);
      alert('Error sending message: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  return (
    <Layout 
      isSiderActive={isSiderActive} 
      toggleSider={() => setIsSiderActive(!isSiderActive)} 
      handleLogout={() => {
        logout();
        navigate("/auth");
      }}
    >
      <div className="chat-container">
        <div className="chat-header">
          <h2>General Chat</h2>
          <div className="user-info">
            <FontAwesomeIcon icon={faUser} />
            <span>{username}</span>
          </div>
        </div>

        <div className="messages-wrapper" ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div 
              className={`message-item ${message.user_id === currentUser.user.id ? 'own-message' : ''}`} 
              key={message.id || index}
            >
              <div className="message-header">
                <img 
                  src={ API_URL + message.avatar || `${API_URL}/default-avatar.png`} 
                  className="user-badge" 
                  alt={message.username} 
                />
                <div className="message-info">
                  <span className="username">{message.username}</span>
                  <span className="timestamp">
                    {new Date(message.created_at).toLocaleString('ru-RU')}
                    {message.updated_at && (
                      <span className="edited-badge">
                       {message.updated_at && message.updated_at !== message.created_at && '(edited)'}
                      </span>
                    )}
                  </span>
                </div>
                
                {(message.user_id === currentUser.user.id || currentUser.user.role === 'admin') && (
                  <div className="message-actions">
                    <button onClick={() => setShowMenu(showMenu === index ? null : index)}>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    
                    {showMenu === index && (
                      <div className="actions-menu">
                        <button onClick={() => handleDeleteMessage(message.id)}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                        {message.user_id === currentUser.user.id && (
                          <button onClick={() => handleEditMessage(message)}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="message-content">
                {message.text && message.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                
                {message.attachments && message.attachments.map((file, i) => (
                  <div key={i} className="attachment-item">
                    {file.type.startsWith('image/') ? (
                      <div className="image-attachment">
                        <img 
                          src={`${API_URL}/uploads/${file.filename}`} 
                          alt={file.originalname}
                          onClick={() => window.open(`${API_URL}/uploads/${file.filename}`, '_blank')}
                        />
                        <span>{file.originalname} ({formatFileSize(file.size)})</span>
                      </div>
                    ) : file.type.startsWith('video/') ? (
                      <div className="video-attachment">
                        <video controls>
                          <source 
                            src={`${API_URL}/uploads/${file.filename}`} 
                            type={file.type} 
                          />
                        </video>
                        <span>{file.originalname} ({formatFileSize(file.size)})</span>
                      </div>
                    ) : (
                      <div className="file-attachment">
                        <a 
                          href={`${API_URL}/uploads/${file.filename}`} 
                          download={file.originalname}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon icon={faFile} />
                          <span>{file.originalname} ({formatFileSize(file.size)})</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSubmit}>
          <div className="attachments-preview">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-item">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} />
                ) : file.type.startsWith('video/') ? (
                  <video controls>
                    <source src={file.url} type={file.type} />
                  </video>
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faFile} />
                    <span>{file.name} ({formatFileSize(file.size)})</span>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => removeAttachment(index)}
                  className="remove-attachment"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>

          <div className="input-group">
            <div className="group">
              <label className="media-upload-button">
                <FontAwesomeIcon icon={faImage} />
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .xls, .xlsx"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
                rows="3"
              />
            </div>
            <button 
              type="submit" 
              disabled={!newMessage.trim() && attachments.length === 0}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              {editingMessage ? 'Update' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatPage;