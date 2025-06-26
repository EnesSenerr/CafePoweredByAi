const ChatbotService = require('../services/chatbotService');

exports.askGeminiBarista = async (req, res) => {
  try {
    const { message } = req.body;
    const userContext = req.user ? { id: req.user.id, name: req.user.name } : {};
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Mesaj boş olamaz' });
    }
    const reply = await ChatbotService.askGemini(message, userContext);
    res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Chatbot yanıtı alınamadı', error: error.message });
  }
}; 