const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Yeni sipariş oluştur
exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, customerPhone, tableNumber, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Sipariş öğeleri gerekli' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Kullanıcı oturumu geçersiz' });
    }

    // Menü öğelerini kontrol et ve fiyatları al
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(400).json({ message: `Menü öğesi bulunamadı: ${item.menuItemId}` });
      }

      if (!menuItem.available) {
        return res.status(400).json({ message: `Menü öğesi mevcut değil: ${menuItem.name}` });
      }

      if (menuItem.stock < item.quantity) {
        return res.status(400).json({ message: `Yeterli stok yok: ${menuItem.name} (Mevcut: ${menuItem.stock})` });
      }

      const orderItem = {
        menuItem: menuItem._id,
        quantity: item.quantity,
        notes: item.notes,
        price: menuItem.price
      };

      orderItems.push(orderItem);
      total += menuItem.price * item.quantity;

      // Stok güncelle
      menuItem.stock -= item.quantity;
      await menuItem.save();
    }

    // Sipariş oluştur
    const order = new Order({
      items: orderItems,
      customerName,
      customerPhone,
      tableNumber,
      notes,
      total,
      createdBy: req.user.id
    });

    // Manuel orderNumber generation (backup)
    if (!order.orderNumber) {
      const count = await Order.countDocuments();
      order.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }

    await order.save();

    // Populate ile menü öğelerini getir
    await order.populate('items.menuItem');
    await order.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Sipariş başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({ message: 'Sipariş oluşturulurken hata oluştu' });
  }
};

// Siparişleri getir
exports.getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 20, skip = 0 } = req.query;

    // Filter objesi oluştur
    const filter = {};
    
    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(filter)
      .populate('items.menuItem')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Siparişleri getirme hatası:', error);
    res.status(500).json({ message: 'Siparişler getirilirken hata oluştu' });
  }
};

// Tekil sipariş getir
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Sipariş getirme hatası:', error);
    res.status(500).json({ message: 'Sipariş getirilirken hata oluştu' });
  }
};

// Sipariş durumunu güncelle
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Geçersiz sipariş durumu' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    // İptal edilen siparişlerde stok geri al
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem) {
          menuItem.stock += item.quantity;
          await menuItem.save();
        }
      }
    }

    order.status = status;
    order.updatedBy = req.user.id;
    await order.save();

    await order.populate('items.menuItem');
    await order.populate('createdBy', 'name email');
    await order.populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: order,
      message: 'Sipariş durumu güncellendi'
    });

  } catch (error) {
    console.error('Sipariş durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sipariş durumu güncellenirken hata oluştu' });
  }
};

// Sipariş sil (sadece admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    // Sipariş tamamlanmışsa veya iptal edilmişse silinmesine izin verme
    if (order.status === 'completed' || order.status === 'cancelled') {
      // Stok geri al (sadece iptal edilmemiş siparişler için)
      if (order.status !== 'cancelled') {
        for (const item of order.items) {
          const menuItem = await MenuItem.findById(item.menuItem);
          if (menuItem) {
            menuItem.stock += item.quantity;
            await menuItem.save();
          }
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Sipariş silindi'
    });

  } catch (error) {
    console.error('Sipariş silme hatası:', error);
    res.status(500).json({ message: 'Sipariş silinirken hata oluştu' });
  }
};

// Sipariş istatistikleri
exports.getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Filter objesi oluştur
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = await Order.aggregate([
      { $match: { ...filter, status: { $in: ['completed'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown: stats
      }
    });

  } catch (error) {
    console.error('Sipariş istatistik hatası:', error);
    res.status(500).json({ message: 'İstatistikler getirilirken hata oluştu' });
  }
}; 