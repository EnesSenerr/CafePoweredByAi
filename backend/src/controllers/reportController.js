const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Satış raporu
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, type = 'custom' } = req.query;

    // Tarih filtresi oluştur
    let dateFilter = {};
    const now = new Date();

    switch (type) {
      case 'daily':
        dateFilter.createdAt = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999))
        };
        break;
      case 'weekly':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        dateFilter.createdAt = { $gte: weekStart, $lte: weekEnd };
        break;
      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        dateFilter.createdAt = { $gte: monthStart, $lte: monthEnd };
        break;
      case 'custom':
        if (startDate || endDate) {
          dateFilter.createdAt = {};
          if (startDate) {
            dateFilter.createdAt.$gte = new Date(startDate);
          }
          if (endDate) {
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999);
            dateFilter.createdAt.$lte = endDateObj;
          }
        }
        break;
    }

    // Temel istatistikler
    const totalOrders = await Order.countDocuments({
      ...dateFilter,
      status: { $in: ['completed'] }
    });

    const totalRevenue = await Order.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Ürün bazlı satış analizi
    const productSales = await Order.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemInfo'
        }
      },
      { $unwind: '$menuItemInfo' },
      {
        $group: {
          _id: '$items.menuItem',
          productName: { $first: '$menuItemInfo.name' },
          category: { $first: '$menuItemInfo.category' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          avgPrice: { $avg: '$items.price' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Günlük satış trendi
    const dailySales = await Order.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          dailyOrders: { $sum: 1 },
          dailyRevenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Kategori bazlı analiz
    const categorySales = await Order.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemInfo'
        }
      },
      { $unwind: '$menuItemInfo' },
      {
        $group: {
          _id: '$menuItemInfo.category',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          avgOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
        },
        productSales,
        dailySales,
        categorySales,
        dateRange: {
          startDate: dateFilter.createdAt?.$gte,
          endDate: dateFilter.createdAt?.$lte,
          type
        }
      }
    });

  } catch (error) {
    console.error('Satış raporu hatası:', error);
    res.status(500).json({ message: 'Satış raporu oluşturulurken hata oluştu' });
  }
};

// Envanter raporu
exports.getInventoryReport = async (req, res) => {
  try {
    // Tüm menü öğelerini getir
    const menuItems = await MenuItem.find({})
      .select('name category price stock available isPopular createdAt')
      .sort({ category: 1, name: 1 });

    // Stok durumu analizi
    const stockAnalysis = {
      totalItems: menuItems.length,
      availableItems: menuItems.filter(item => item.available).length,
      outOfStock: menuItems.filter(item => item.stock === 0).length,
      lowStock: menuItems.filter(item => item.stock > 0 && item.stock <= 5).length,
      inStock: menuItems.filter(item => item.stock > 5).length
    };

    // Kategori bazlı envanter
    const categoryInventory = {};
    menuItems.forEach(item => {
      if (!categoryInventory[item.category]) {
        categoryInventory[item.category] = {
          totalItems: 0,
          availableItems: 0,
          totalStockValue: 0,
          avgPrice: 0,
          items: []
        };
      }
      
      categoryInventory[item.category].totalItems++;
      if (item.available) categoryInventory[item.category].availableItems++;
      categoryInventory[item.category].totalStockValue += item.stock * item.price;
      categoryInventory[item.category].items.push(item);
    });

    // Her kategori için ortalama fiyat hesapla
    Object.keys(categoryInventory).forEach(category => {
      const items = categoryInventory[category].items;
      categoryInventory[category].avgPrice = items.length > 0 
        ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
        : 0;
    });

    // En çok satan ürünler (son 30 gün)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topSellingProducts = await Order.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $project: {
          name: '$menuItem.name',
          category: '$menuItem.category',
          currentStock: '$menuItem.stock',
          totalSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        stockAnalysis,
        categoryInventory,
        topSellingProducts,
        menuItems,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Envanter raporu hatası:', error);
    res.status(500).json({ message: 'Envanter raporu oluşturulurken hata oluştu' });
  }
};

// Rapor indirme (Excel formatında)
exports.downloadReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, type } = req.query;

    let reportData;

    switch (reportType) {
      case 'sales':
        // Satış raporu verilerini al
        const salesReportReq = { query: { startDate, endDate, type } };
        const salesReportRes = { json: (data) => { reportData = data; } };
        await exports.getSalesReport(salesReportReq, salesReportRes);
        break;

      case 'inventory':
        // Envanter raporu verilerini al
        const inventoryReportReq = { query: {} };
        const inventoryReportRes = { json: (data) => { reportData = data; } };
        await exports.getInventoryReport(inventoryReportReq, inventoryReportRes);
        break;

      default:
        return res.status(400).json({ message: 'Geçersiz rapor türü' });
    }

    // Excel dosyası oluşturmak için gerekli veriler hazır
    // Şimdilik JSON formatında döndür, ileride xlsx kütüphanesi ile Excel dosyası oluşturulabilir
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${reportType}-raporu-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json({
      success: true,
      reportType,
      generatedAt: new Date(),
      data: reportData?.data || reportData
    });

  } catch (error) {
    console.error('Rapor indirme hatası:', error);
    res.status(500).json({ message: 'Rapor indirilirken hata oluştu' });
  }
}; 