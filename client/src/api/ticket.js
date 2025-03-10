export const postTicket = async (ticketData) => {
  try {
    return "1232";
      const API_URL = "http://localhost:4200/api/tickets";
      const response = await axios.post(API_URL, ticketData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка регистрации на api/ticket.js");
      throw error;
    }
  }