const Reward = require('../models/Reward');

/**
 * Tüm ödülleri listeler (kullanıcı tarafı)
 * @route GET /api/rewards
 * @access Public
 */
exports.getAllRewards = async (req, res) => {
  try {
    // Sadece aktif ödülleri getir ve kategoriye göre sırala
    const rewards = await Reward.find({ isActive: true })
      .sort({ category: 1, pointCost: 1 });

    return res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (error) {
    console.error('Ödül listeleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödüller getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Belirli bir ödülün detaylarını getirir
 * @route GET /api/rewards/:id
 * @access Public
 */
exports.getReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Ödül bulunamadı'
      });
    }

    return res.status(200).json({
      success: true,
      data: reward
    });
  } catch (error) {
    console.error('Ödül getirme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödül getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// --- Admin Controllers ---

/**
 * Tüm ödülleri listeler (admin tarafı, aktif olmayan ödüller dahil)
 * @route GET /api/admin/rewards
 * @access Private (Admin)
 */
exports.adminGetAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards
    });
  } catch (error) {
    console.error('Admin ödül listeleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödüller getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Yeni ödül oluşturur
 * @route POST /api/admin/rewards
 * @access Private (Admin)
 */
exports.createReward = async (req, res) => {
  try {
    const { name, description, pointCost, category, image, quantity, expiryDate } = req.body;
    
    // Temel validasyon
    if (!name || !pointCost) {
      return res.status(400).json({
        success: false,
        message: 'Ödül adı ve puan maliyeti zorunludur'
      });
    }

    const reward = await Reward.create({
      name,
      description,
      pointCost,
      category: category || 'diğer',
      image,
      quantity,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    return res.status(201).json({
      success: true,
      data: reward,
      message: 'Ödül başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Ödül oluşturma hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödül oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Ödül bilgilerini günceller
 * @route PUT /api/admin/rewards/:id
 * @access Private (Admin)
 */
exports.updateReward = async (req, res) => {
  try {
    const { name, description, pointCost, category, image, isActive, quantity, expiryDate } = req.body;
    
    let reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Ödül bulunamadı'
      });
    }

    // Güncelleme
    reward = await Reward.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        pointCost,
        category,
        image,
        isActive,
        quantity,
        expiryDate: expiryDate ? new Date(expiryDate) : reward.expiryDate
      },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      data: reward,
      message: 'Ödül başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Ödül güncelleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödül güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Ödül siler
 * @route DELETE /api/admin/rewards/:id
 * @access Private (Admin)
 */
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Ödül bulunamadı'
      });
    }

    await reward.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
      message: 'Ödül başarıyla silindi'
    });
  } catch (error) {
    console.error('Ödül silme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ödül silinirken bir hata oluştu',
      error: error.message
    });
  }
}; 