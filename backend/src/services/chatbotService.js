const axios = require('axios');
const MenuItem = require('../models/MenuItem');
const Reward = require('../models/Reward');
const User = require('../models/User');

class ChatbotService {
  constructor() {
    this.geminiApiUrl = process.env.GEMINI_API_URL;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  async askGemini(message, userContext = {}) {
    // Menü ve ödülleri çek
    const menuItems = await MenuItem.find({ available: true }).limit(10);
    const rewards = await Reward.find({ isActive: true }).limit(5);
    let userInfo = '';
    let user = null;
    let userName = '';
    let userPoints = '';
    let userLastLogin = '';
    if (userContext && userContext.id) {
      user = await User.findById(userContext.id);
      if (user) {
        userName = user.name;
        userPoints = user.points;
        userLastLogin = user.lastLogin ? user.lastLogin.toLocaleString('tr-TR') : '-';
        userInfo = `\nKullanıcı Bilgileri:\n- Ad: ${userName}\n- Puan: ${userPoints}\n- Son Giriş: ${userLastLogin}\n`;
      }
    }
    const menuList = menuItems.map(item => `- ${item.name} (${item.description})`).join('\n');
    const rewardList = rewards.map(r => `- ${r.name}: ${r.description} (Puan: ${r.pointCost})`).join('\n');
    const cafeInfo = `Kafe Adı: AI Cafe\nÇalışma Saatleri: 08:00 - 22:00\nAdres: İstanbul, Kadıköy\nMenü:\n${menuList}\nÖdüller:\n${rewardList}`;
    // Gelişmiş sistem prompt'u ve örnek diyalog
    const systemPrompt = `Sen AI Cafe'nin Barista Asistanısın. Kullanıcıya kafe hakkında detaylı, güncel ve kişiselleştirilmiş yanıtlar ver.\nKafe Bilgileri:\n${cafeInfo}${userInfo}\n\nEğer kullanıcı puanını sorarsa, yukarıdaki kullanıcı bilgilerini kullanarak doğrudan puanını belirt.\n\nÖrnek:\nKullanıcı: Şu an kaç puanım var?\nBarista: Şu anda hesabınızda ${userPoints || '[puan bilgisi yok]'} puan bulunuyor. Bu puanlarla ödüllerimizden faydalanabilirsiniz!\n\nYanıtlarında kafe atmosferini hissettir, menüden önerilerde bulun, ödüller ve kampanyalar hakkında bilgi ver.`;
    const prompt = `${systemPrompt}\n\nKullanıcı: ${message}\n\nBarista:`;
    // LLM'e gönderilen prompt'u logla
    console.log('[Gemini API] GÖNDERİLEN PROMPT (tam metin):\n', prompt);
    const url = `${this.geminiApiUrl}?key=${this.geminiApiKey}`;
    const payload = {
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        topK: 30,
        maxOutputTokens: 4096
      }
    };
    const headers = { 'Content-Type': 'application/json' };
    try {
      const res = await axios.post(url, payload, { headers });
      console.log('[Gemini API] HAM YANIT (JSON):', JSON.stringify(res.data, null, 2));
      const generatedText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      let reply = generatedText ? generatedText.trim() : null;
      // Parse edilen cevabı logla
      console.log('[Gemini API] PARSE EDİLEN YANIT:', reply);
      if (!reply || reply === '{}' || (typeof reply === 'string' && reply.trim() === '')) {
        reply = 'Üzgünüm, şu anda yardımcı olamıyorum. Lütfen daha farklı bir soru sor.';
      }
      return reply;
    } catch (err) {
      console.error('[Gemini API] Hata:', err.response?.data || err.message);
      throw new Error('AI Barista yanıtı alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  }
}

module.exports = new ChatbotService(); 