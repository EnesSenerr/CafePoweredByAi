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

    // Kullanıcının en çok tercih ettiği ürünleri ve kategorileri bul
    const itemCounts = {};
    const categoryCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.menuItem._id.toString();
        itemCounts[id] = (itemCounts[id] || 0) + item.quantity;
        const cat = item.menuItem.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
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
        if (topCategories.includes(item.menuItem.category)) {
          const id = item.menuItem._id.toString();
          similarItemCounts[id] = (similarItemCounts[id] || 0) + item.quantity;
        }
      });
    });
    // Tüm menüden öneri adaylarını getir
    const allItems = await MenuItem.find({ available: true });
    // Skor hesapla: kullanıcı geçmişi + benzer kullanıcılar + popülerlik
    const scored = allItems.map(item => {
      const id = item._id.toString();
      let score = 0;
      if (itemCounts[id]) score += itemCounts[id] * 3;
      if (similarItemCounts[id]) score += similarItemCounts[id] * 2;
      if (topCategories.includes(item.category)) score += 2;
      if (item.isPopular) score += 1;
      return { item, score };
    });
    // Skora göre sırala ve limit kadar döndür
    return scored
      .sort((a,b) => b.score - a.score)
      .slice(0, limit)
      .map(({item, score}) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isPopular: item.isPopular,
        score,
        reason: `Senin gibi kahve severler bu ürünü de denedi!`
      }));
  }
}

module.exports = new RecommendationService(); 