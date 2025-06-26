const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

class RecommendationService {
  // Kullanıcının sipariş geçmişine dayalı öneriler
  async getUserBasedRecommendations(userId, limit = 6) {
    // Son 6 ayın siparişlerini al
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const orders = await Order.find({
      createdBy: userId,
      status: 'completed',
      createdAt: { $gte: sixMonthsAgo }
    }).populate('items.menuItem');

    // Kullanıcıyı çek (favoriler için)
    const user = await require('../models/User').findById(userId);
    const favorites = user?.favorites?.map(f => f.toString()) || [];

    // Kullanıcının en çok tercih ettiği ürünler ve kategoriler
    const itemCounts = {};
    const categoryCounts = {};
    const recentItems = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!item.menuItem) return; // Null ise atla
        const id = item.menuItem._id.toString();
        itemCounts[id] = (itemCounts[id] || 0) + item.quantity;
        const cat = item.menuItem.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
        recentItems.add(id);
      });
    });
    // En çok tercih edilen kategoriler
    const topCategories = Object.entries(categoryCounts)
      .sort(([,a],[,b]) => b-a)
      .slice(0,2)
      .map(([cat]) => cat);
    // Collaborative filtering: Benzer kullanıcılar bul
    const similarOrders = await Order.find({
      status: 'completed',
      createdBy: { $ne: userId },
      'items.menuItem': { $exists: true },
      createdAt: { $gte: sixMonthsAgo }
    }).populate('items.menuItem');
    // Benzer kullanıcıların en çok tercih ettiği ürünler
    const similarItemCounts = {};
    similarOrders.forEach(order => {
      order.items.forEach(item => {
        if (!item.menuItem || !item.menuItem.category) return; // Null ise atla
        if (topCategories.includes(item.menuItem.category)) {
          const id = item.menuItem._id.toString();
          similarItemCounts[id] = (similarItemCounts[id] || 0) + item.quantity;
        }
      });
    });
    // Tüm menüden öneri adaylarını getir
    const allItems = await MenuItem.find({ available: true });
    // Saat bazlı kategori
    const hour = new Date().getHours();
    let timeCategory = null;
    if (hour >= 6 && hour < 11) timeCategory = 'Atıştırmalık'; // Kahvaltı
    else if (hour >= 11 && hour < 17) timeCategory = 'Kahve'; // Öğle/ikindi
    else if (hour >= 17 && hour < 23) timeCategory = 'Tatlı'; // Akşam
    // Son 30 günde eklenen ürünler
    const now = new Date();
    const newItemsSet = new Set(
      allItems.filter(item => (now - item.createdAt) < 1000*60*60*24*30).map(item => item._id.toString())
    );
    // Skor hesapla: favoriler + kullanıcı geçmişi + benzer kullanıcılar + popülerlik + yeni ürün + saat + çeşitlilik
    const scored = allItems.map(item => {
      const id = item._id.toString();
      let score = 0;
      let reasons = [];
      if (favorites.includes(id)) { score += 10; reasons.push('Favorilerin arasında'); }
      if (itemCounts[id]) { score += itemCounts[id] * 3; reasons.push('Sıkça sipariş ettin'); }
      if (similarItemCounts[id]) { score += similarItemCounts[id] * 2; reasons.push('Senin gibi kullanıcılar seviyor'); }
      if (topCategories.includes(item.category)) { score += 2; reasons.push('Favori kategorinde'); }
      if (item.isPopular) { score += 1; reasons.push('Popüler ürün'); }
      if (newItemsSet.has(id)) { score += 3; reasons.push('Yeni çıkan ürün'); }
      if (timeCategory && item.category === timeCategory) { score += 2; reasons.push('Şu an için ideal'); }
      // Çeşitlilik: Kullanıcının hiç denemediği ürünlere ekstra skor (ama favori/son sipariş değilse)
      if (!recentItems.has(id) && !favorites.includes(id)) { score += 1; reasons.push('Daha önce denemedin'); }
      return { item, score, reasons };
    });
    // Skora göre sırala ve limit kadar döndür
    return scored
      .sort((a,b) => b.score - a.score)
      .slice(0, limit)
      .map(({item, score, reasons}) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isPopular: item.isPopular,
        score,
        reason: reasons.length > 0 ? reasons.join(', ') : 'Senin için önerildi'
      }));
  }
}

module.exports = new RecommendationService(); 