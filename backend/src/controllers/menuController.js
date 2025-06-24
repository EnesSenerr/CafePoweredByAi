const MenuItem = require('../models/MenuItem');
const StockItem = require('../models/StockItem');

// Tüm menü öğelerini getir
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, available, search } = req.query;
    let query = {};

    // Filtreleme
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    
    // Arama
    if (search) {
      query.$text = { $search: search };
    }

    const menuItems = await MenuItem.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('requiredIngredients.stockItem', 'name currentStock unit category stockStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğeleri getirilirken hata oluştu',
      error: error.message
    });
  }
};

// Tek menü öğesi getir
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('requiredIngredients.stockItem', 'name currentStock unit category stockStatus minStock');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi getirilirken hata oluştu',
      error: error.message
    });
  }
};

// Yeni menü öğesi oluştur
exports.createMenuItem = async (req, res) => {
  try {
    const menuItemData = {
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id
    };

    // Gerekli malzemelerin varlığını kontrol et
    if (menuItemData.requiredIngredients && menuItemData.requiredIngredients.length > 0) {
      const stockItemIds = menuItemData.requiredIngredients.map(ing => ing.stockItem);
      const stockItems = await StockItem.find({ _id: { $in: stockItemIds } });
      
      if (stockItems.length !== stockItemIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Bazı malzemeler stok sisteminde bulunamadı'
        });
      }
    }

    const menuItem = await MenuItem.create(menuItemData);
    
    // Populate edilmiş versiyonu getir
    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('requiredIngredients.stockItem', 'name currentStock unit category stockStatus');

    res.status(201).json({
      success: true,
      message: 'Menü öğesi başarıyla oluşturuldu',
      data: populatedMenuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    
    // Validation error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Menü öğesi oluşturulurken hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi güncelle
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Gerekli malzemelerin varlığını kontrol et
    if (updateData.requiredIngredients && updateData.requiredIngredients.length > 0) {
      const stockItemIds = updateData.requiredIngredients.map(ing => ing.stockItem);
      const stockItems = await StockItem.find({ _id: { $in: stockItemIds } });
      
      if (stockItems.length !== stockItemIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Bazı malzemeler stok sisteminde bulunamadı'
        });
      }
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email')
     .populate('requiredIngredients.stockItem', 'name currentStock unit category stockStatus');

    res.status(200).json({
      success: true,
      message: 'Menü öğesi başarıyla güncellendi',
      data: updatedMenuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    
    // Validation error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Menü öğesi güncellenirken hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi sil
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Menü öğesi başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi silinirken hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi durumunu değiştir (available toggle)
exports.toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }

    menuItem.available = !menuItem.available;
    menuItem.updatedBy = req.user.id;
    await menuItem.save();

    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Menü öğesi ${menuItem.available ? 'aktif' : 'pasif'} edildi`,
      data: populatedMenuItem
    });
  } catch (error) {
    console.error('Toggle menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi durumu değiştirilirken hata oluştu',
      error: error.message
    });
  }
};

// Stok güncelle
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stok negatif olamaz'
      });
    }

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }

    menuItem.stock = stock;
    menuItem.updatedBy = req.user.id;
    await menuItem.save();

    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Stok başarıyla güncellendi',
      data: populatedMenuItem
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Stok güncellenirken hata oluştu',
      error: error.message
    });
  }
};

// Kategorileri getir
exports.getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler getirilirken hata oluştu',
      error: error.message
    });
  }
}; 