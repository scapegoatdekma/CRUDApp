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
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
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
          file
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
    const storedAvatar = localStorage.getItem("avatar");
    
    if (storedUsername) setUsername(storedUsername);
    if (storedAvatar) {
      // Логика установки аватара
    }
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
      setMessages(previousMessages => previousMessages.filter(message => message.id !== messageId));
    };

    const handleUpdateMessage = (updatedMessage) => {
      setMessages(previousMessages => previousMessages.map(message => 
        message.id === updatedMessage.id ? { ...message, ...updatedMessage } : message
      ));
    };

    const handleMessagesError = (error) => {
      console.error('Error loading history:', error);
      alert('Failed to load message history');
    };

    socket.on('messages_history', handleHistory);
    socket.on('new_message', handleNewMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('message_updated', handleUpdateMessage);
    socket.on('messages_error', handleMessagesError);

    return () => {
      socket.off('messages_history', handleHistory);
      socket.off('new_message', handleNewMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('message_updated', handleUpdateMessage);
      socket.off('messages_error', handleMessagesError);
    };
  }, []);

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Delete message?')) {
      socket.emit('delete_message', { 
        messageId,
        userId: currentUser.user.id 
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
      const uploadedFiles = [];
      const formData = new FormData();
      
      for (const attachment of attachments) {
        if (attachment.file) {
          formData.append('attachments', attachment.file);
        }
      }
  
      if (formData.has('attachments')) {
        const uploadResponse = await fetch('/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) throw new Error('File upload failed');
        const result = await uploadResponse.json();
        uploadedFiles.push(...result);
      }
  
      if (editingMessage) {
        socket.emit('update_message', {
          id: editingMessage.id,
          text: newMessage.trim(),
          userId: currentUser.user.id,
          attachments: uploadedFiles
        });
        setEditingMessage(null);
      } else if (newMessage.trim() || uploadedFiles.length > 0) {
        socket.emit('new_message', {
          text: newMessage.trim(),
          username: username.trim(),
          user_id: currentUser.user.id,
          created_at: new Date().toISOString(),
          attachments: uploadedFiles
        });
      }
      
      setNewMessage('');
      setAttachments([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Message send error:', error);
      alert('Error sending message');
    }
  };

  const isMessageEdited = (message) => {
    return message.updated_at && new Date(message.updated_at).getTime() > new Date(message.created_at).getTime();
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
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Your name"
              aria-label="Username"
            />
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
                  src={'http://localhost:4200' + message.avatar || 'http://localhost:4200/default-avatar.png'} 
                  className="user-badge" 
                  alt={message.username} 
                />
                <div className="message-info">
                  <span className="username">{message.username}</span>
                  <span className="timestamp">
                    {new Date(message.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}, 
                    {new Date(message.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isMessageEdited(message) && (
                      <span className="edited-badge"> (edited)</span>
                    )}
                  </span>
                </div>
                
                <div className="message-actions">
                  <button 
                    className="dots-btn"
                    onClick={() => setShowMenu(showMenu === index ? null : index)}
                    aria-label="Message actions"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  
                  {showMenu === index && (
                    <div className="actions-menu">
                      {(currentUser.user.id === message.user_id || currentUser.user.role === 'admin') && (
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          className="delete-btn"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      )}
                      {currentUser.user.id === message.user_id && (
                        <button 
                          onClick={() => handleEditMessage(message)}
                          className="edit-btn"
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="message-content">
                {message.text && message.text.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))}
                {message.attachments?.map((file, fileIndex) => (
                  <div key={fileIndex} className="attachment-item">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        onError={(event) => {
                          event.target.src = 'http://localhost:4200/default-image.png';
                          event.target.alt = 'Failed to load image';
                        }}
                      />
                    ) : file.type === 'video' ? (
                      <video controls playsInline>
                        <source src={file.url} type={`video/${file.url.split('.').pop()}`} />
                        Your browser does not support video
                      </video>
                    ) : file.type === 'audio' ? (
                      <audio controls>
                        <source src={file.url} type={`audio/${file.url.split('.').pop()}`} />
                        Your browser does not support audio
                      </audio>
                    ) : (
                      <a href={file.url} download={file.name}>
                        <FontAwesomeIcon icon={faFile} /> {file.name}
                      </a>
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
                {file.type === 'image' && (
                  <img src={file.url} alt={file.name} />
                )}
                {file.type === 'video' && (
                  <video controls playsInline>
                    <source src={file.url} type="video/mp4" />
                  </video>
                )}
                {file.type === 'audio' && (
                  <audio controls>
                    <source src={file.url} type="audio/mpeg" />
                  </audio>
                )}
                <button 
                  type="button" 
                  onClick={() => removeAttachment(index)}
                  className="remove-attachment"
                  aria-label="Remove attachment"
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
                  accept="image/*, video/*, audio/*"
                  ref={fileInputRef}
                  className="file-input"
                  aria-label="Add attachments"
                  style={{ display: 'none' }}
                />
              </label>
              <textarea
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Write your message..."
                rows="3"
                aria-label="Message text"
              />
            </div>
            <button 
              type="submit" 
              className="send-button"
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