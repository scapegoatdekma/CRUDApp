import { Server } from 'socket.io';
import { getMessages, saveMessage, updateMessage, deleteMessage } from './messages.js';

export const setupChat = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://192.168.1.119:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', async (socket) => {
    console.log('Новое соединение:', socket.id, socket.handshake.auth);

    try {
      // Отправка истории сообщений при подключении
      const messages = await getMessages();
      socket.emit('messages_history', messages);
    } catch (error) {
      console.error('Ошибка при загрузке истории сообщений:', error);
      socket.emit('messages_error', {
        type: 'LOAD_HISTORY_ERROR',
        message: 'Не удалось загрузить историю сообщений'
      });
    }

    socket.on('get_history', async () => {
      try {
        const messages = await getMessages();
        socket.emit('messages_history', messages);
      } catch (error) {
        console.error('Ошибка при загрузке истории:', error);
        socket.emit('messages_error', {
          type: 'LOAD_HISTORY_ERROR',
          message: 'Не удалось загрузить историю'
        });
      }
    });

    // Обработка нового сообщения
    socket.on('new_message', async (data) => {
      try {
        console.log('Получено новое сообщение:', {
          user: data.user_id,
          textLength: data.text?.length,
          attachmentsCount: data.attachments?.length || 0
        });

        const savedMessage = await saveMessage(
          data.text,
          data.username,
          data.user_id,
          data.attachments
        );
        
        io.emit('new_message', savedMessage);
      } catch (error) {
        console.error('Ошибка при сохранении сообщения:', error);
        socket.emit('messages_error', {
          type: 'SAVE_MESSAGE_ERROR',
          message: 'Не удалось отправить сообщение',
          details: error.message
        });
      }
    });

    // Обработка обновления сообщения
    socket.on('update_message', async (data) => {
      try {
        console.log('Обновление сообщения:', {
          messageId: data.id,
          userId: data.userId
        });

        const updatedMessage = await updateMessage(
          data.id,
          data.text,
          data.userId,
          data.attachments
        );
        
        io.emit('message_updated', updatedMessage);
      } catch (error) {
        console.error('Ошибка при обновлении сообщения:', error);
        socket.emit('messages_error', {
          type: 'UPDATE_MESSAGE_ERROR',
          message: 'Не удалось обновить сообщение',
          details: error.message
        });
      }
    });

    // Обработка удаления сообщения
    socket.on('delete_message', async (data) => {
      try {
        console.log('Удаление сообщения:', {
          messageId: data.messageId,
          userId: data.userId,
          isAdmin: data.isAdmin
        });

        const result = await deleteMessage(
          data.messageId,
          data.userId,
          data.isAdmin
        );
        
        if (result) {
          io.emit('message_deleted', {
            id: data.messageId,
            deletedAt: new Date().toISOString()
          });
        } else {
          socket.emit('messages_error', {
            type: 'DELETE_MESSAGE_ERROR',
            message: 'Сообщение не найдено или нет прав для удаления'
          });
        }
      } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
        socket.emit('messages_error', {
          type: 'DELETE_MESSAGE_ERROR',
          message: 'Не удалось удалить сообщение',
          details: error.message
        });
      }
    });

    // Обработка отключения клиента
    socket.on('disconnect', (reason) => {
      console.log(`Клиент отключен: ${socket.id}, причина: ${reason}`);
    });

    // Обработка ошибок соединения
    socket.on('error', (error) => {
      console.error('Ошибка соединения:', error);
    });
  });

  // Мониторинг состояния сервера
  setInterval(() => {
    const socketsCount = io.engine.clientsCount;
    console.log(`Текущее количество подключений: ${socketsCount}`);
  }, 60000);

  return io;
};