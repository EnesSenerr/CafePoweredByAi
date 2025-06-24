const StockItem = require('../models/StockItem');
const MenuItem = require('../models/MenuItem');

// Tüm stok öğelerini getir
exports.getStockItems = async (req, res) => {
  try {
    const { category, status, search, limit = 50, skip = 0 } = req.query;

    // Filter objesi oluştur
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const stockItems = await StockItem.find(filter)
      .populate('updatedBy', 'name email')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Status filter (virtual field olduğu için post-query filtering)
    let filteredItems = stockItems;
    if (status) {
      filteredItems = stockItems.filter(item => item.stockStatus === status);
    }

    const total = await StockItem.countDocuments(filter);

    res.json({
      success: true,
      data: filteredItems,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Stok öğeleri getirme hatası:', error);
    res.status(500).json({ message: 'Stok öğeleri getirilirken hata oluştu' });
  }
};

// Tek stok öğesi getir (hangi menü öğelerinde kullanıldığı bilgisi ile)
exports.getStockItem = async (req, res) => {
  try {
    const stockItem = await StockItem.findById(req.params.id)
      .populate('updatedBy', 'name email');

    if (!stockItem) {
      return res.status(404).json({ message: 'Stok öğesi bulunamadı' });
    }

    // Bu stok öğesini kullanan menü öğelerini bul
    const menuItems = await MenuItem.find({
      'requiredIngredients.stockItem': req.params.id,
      available: true
    }).select('name category price requiredIngredients');

    res.json({
      success: true,
      data: {
        ...stockItem.toJSON(),
        usedInMenuItems: menuItems.map(item => ({
          _id: item._id,
          name: item.name,
          category: item.category,
          price: item.price,
          requiredQuantity: item.requiredIngredients.find(
            ing => ing.stockItem.toString() === req.params.id
          )?.quantity || 0,
          requiredUnit: item.requiredIngredients.find(
            ing => ing.stockItem.toString() === req.params.id
          )?.unit || stockItem.unit
        }))
      }
    });

  } catch (error) {
    console.error('Stok öğesi getirme hatası:', error);
    res.status(500).json({ message: 'Stok öğesi getirilirken hata oluştu' });
  }
};

// Yeni stok öğesi oluştur
exports.createStockItem = async (req, res) => {
  try {
    const { name, category, currentStock, minStock, unit, price, supplier, description } = req.body;

    if (!name || !category || currentStock === undefined || minStock === undefined || !unit) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    // Aynı isimde stok öğesi var mı kontrol et
    const existingItem = await StockItem.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingItem) {
      return res.status(400).json({ message: 'Bu isimde bir stok öğesi zaten mevcut' });
    }

    const stockItem = new StockItem({
      name,
      category,
      currentStock,
      minStock,
      unit,
      price: price || 0,
      supplier,
      description,
      updatedBy: req.user.id
    });

    await stockItem.save();

    await stockItem.populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      data: stockItem,
      message: 'Stok öğesi başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Stok öğesi oluşturma hatası:', error);
    res.status(500).json({ message: 'Stok öğesi oluşturulurken hata oluştu' });
  }
};

// Birim çevirimi fonksiyonları
function convertToBaseUnit(value, unit) {
  switch (unit) {
    case 'kg':
      return value * 1000; // gram'a çevir
    case 'litre':
      return value * 1000; // ml'ye çevir
    case 'paket':
    case 'kutu':
    case 'adet':
    case 'gram':
    case 'ml':
      return value; // Zaten base unit
    default:
      return value;
  }
}

function normalizeUnits(requiredAmount, requiredUnit, availableAmount, availableUnit) {
  // Aynı birim grubuna mı ait kontrol et
  const weightUnits = ['gram', 'kg'];
  const volumeUnits = ['ml', 'litre'];
  const countUnits = ['adet', 'paket', 'kutu'];
  
  // Eğer aynı birim grubundaysa çevir
  if (weightUnits.includes(requiredUnit) && weightUnits.includes(availableUnit)) {
    return {
      required: convertToBaseUnit(requiredAmount, requiredUnit),
      available: convertToBaseUnit(availableAmount, availableUnit),
      unit: 'gram'
    };
  }
  
  if (volumeUnits.includes(requiredUnit) && volumeUnits.includes(availableUnit)) {
    return {
      required: convertToBaseUnit(requiredAmount, requiredUnit),
      available: convertToBaseUnit(availableAmount, availableUnit),
      unit: 'ml'
    };
  }
  
  if (countUnits.includes(requiredUnit) && countUnits.includes(availableUnit)) {
    return {
      required: requiredAmount,
      available: availableAmount,
      unit: requiredUnit
    };
  }
  
  // Farklı birim grubundaysa çeviremez, olduğu gibi dön
  return {
    required: requiredAmount,
    available: availableAmount,
    unit: requiredUnit
  };
}

// Hangi menü öğelerinin yapılamayacağını kontrol et
exports.checkMenuAvailability = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true })
      .populate('requiredIngredients.stockItem', 'name currentStock unit stockStatus')
      .select('name category requiredIngredients');

    const availability = menuItems.map(item => {
      const unavailableIngredients = item.requiredIngredients.filter(ingredient => {
        if (!ingredient.stockItem) return true;
        
        // Birim çevirimi yap
        const normalized = normalizeUnits(
          ingredient.quantity,
          ingredient.unit,
          ingredient.stockItem.currentStock,
          ingredient.stockItem.unit
        );
        
        return normalized.available < normalized.required;
      });

      return {
        _id: item._id,
        name: item.name,
        category: item.category,
        canMake: unavailableIngredients.length === 0,
        unavailableIngredients: unavailableIngredients.map(ing => {
          // Birim çevirimi ile eksik miktarı hesapla
          const normalized = normalizeUnits(
            ing.quantity,
            ing.unit,
            ing.stockItem?.currentStock || 0,
            ing.stockItem?.unit || ing.unit
          );
          
          return {
            name: ing.stockItem?.name || 'Bilinmeyen malzeme',
            required: normalized.required,
            available: normalized.available,
            unit: normalized.unit,
            shortage: Math.max(0, normalized.required - normalized.available)
          };
        })
      };
    });

    res.json({
      success: true,
      data: availability,
      summary: {
        total: availability.length,
        available: availability.filter(item => item.canMake).length,
        unavailable: availability.filter(item => !item.canMake).length
      }
    });

  } catch (error) {
    console.error('Menü uygunluk kontrolü hatası:', error);
    res.status(500).json({ message: 'Menü uygunluk kontrolü yapılırken hata oluştu' });
  }
};

// Stok öğesi güncelle
exports.updateStockItem = async (req, res) => {
  try {
    const { name, category, currentStock, minStock, unit, price, supplier, description } = req.body;

    const stockItem = await StockItem.findById(req.params.id);

    if (!stockItem) {
      return res.status(404).json({ message: 'Stok öğesi bulunamadı' });
    }

    // Aynı isimde başka stok öğesi var mı kontrol et (kendisi hariç)
    if (name && name !== stockItem.name) {
      const existingItem = await StockItem.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingItem) {
        return res.status(400).json({ message: 'Bu isimde bir stok öğesi zaten mevcut' });
      }
    }

    // Güncelleme alanları
    if (name) stockItem.name = name;
    if (category) stockItem.category = category;
    if (currentStock !== undefined) stockItem.currentStock = currentStock;
    if (minStock !== undefined) stockItem.minStock = minStock;
    if (unit) stockItem.unit = unit;
    if (price !== undefined) stockItem.price = price;
    if (supplier !== undefined) stockItem.supplier = supplier;
    if (description !== undefined) stockItem.description = description;
    
    stockItem.lastUpdated = new Date();
    stockItem.updatedBy = req.user.id;

    await stockItem.save();
    await stockItem.populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: stockItem,
      message: 'Stok öğesi başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Stok öğesi güncelleme hatası:', error);
    res.status(500).json({ message: 'Stok öğesi güncellenirken hata oluştu' });
  }
};

// Stok girişi/çıkışı
exports.updateStock = async (req, res) => {
  try {
    const { quantity, type, notes } = req.body; // type: 'in' veya 'out'

    if (!quantity || !type || !['in', 'out'].includes(type)) {
      return res.status(400).json({ message: 'Geçersiz stok işlemi parametreleri' });
    }

    const stockItem = await StockItem.findById(req.params.id);

    if (!stockItem) {
      return res.status(404).json({ message: 'Stok öğesi bulunamadı' });
    }

    const oldStock = stockItem.currentStock;

    if (type === 'in') {
      stockItem.currentStock += quantity;
    } else {
      if (stockItem.currentStock < quantity) {
        return res.status(400).json({ message: 'Yetersiz stok' });
      }
      stockItem.currentStock -= quantity;
    }

    stockItem.lastUpdated = new Date();
    stockItem.updatedBy = req.user.id;

    await stockItem.save();
    await stockItem.populate('updatedBy', 'name email');

    // TODO: StockTransaction modeli oluşturup transaction kayıt et

    res.json({
      success: true,
      data: stockItem,
      message: `Stok ${type === 'in' ? 'girişi' : 'çıkışı'} başarıyla yapıldı`,
      stockChange: {
        oldStock,
        newStock: stockItem.currentStock,
        change: type === 'in' ? quantity : -quantity,
        type,
        notes
      }
    });

  } catch (error) {
    console.error('Stok güncelleme hatası:', error);
    res.status(500).json({ message: 'Stok güncellenirken hata oluştu' });
  }
};

// Stok öğesi sil (soft delete)
exports.deleteStockItem = async (req, res) => {
  try {
    const stockItem = await StockItem.findById(req.params.id);

    if (!stockItem) {
      return res.status(404).json({ message: 'Stok öğesi bulunamadı' });
    }

    stockItem.isActive = false;
    stockItem.lastUpdated = new Date();
    stockItem.updatedBy = req.user.id;

    await stockItem.save();

    res.json({
      success: true,
      message: 'Stok öğesi başarıyla silindi'
    });

  } catch (error) {
    console.error('Stok öğesi silme hatası:', error);
    res.status(500).json({ message: 'Stok öğesi silinirken hata oluştu' });
  }
};

// Kritik stok seviyesindeki öğeleri getir
exports.getCriticalStock = async (req, res) => {
  try {
    const stockItems = await StockItem.find({ isActive: true })
      .populate('updatedBy', 'name email')
      .sort({ currentStock: 1 });

    const criticalItems = stockItems.filter(item => 
      item.currentStock <= item.minStock || item.currentStock === 0
    );

    res.json({
      success: true,
      data: criticalItems,
      total: criticalItems.length
    });

  } catch (error) {
    console.error('Kritik stok getirme hatası:', error);
    res.status(500).json({ message: 'Kritik stok getirilirken hata oluştu' });
  }
};

// Stok kategorileri getir
exports.getStockCategories = async (req, res) => {
  try {
    const categories = await StockItem.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Stok kategorileri getirme hatası:', error);
    res.status(500).json({ message: 'Stok kategorileri getirilirken hata oluştu' });
  }
}; 