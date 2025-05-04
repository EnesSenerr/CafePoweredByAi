const User = require('../models/User');
const PointTransaction = require('../models/PointTransaction');
const Reward = require('../models/Reward');
const { calculatePointsEarned, hasEnoughPoints, updatePointBalance } = require('../utils/pointCalculations');

/**
 * Puan kazanım endpoint'i
 * @route POST /api/points/earn
 * @access Private
 */
exports.earnPoints = async (req, res) => {
  try {
    const { userId, amount, orderId, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Geçersiz kullanıcı veya tutar' 
      });
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Kullanıcı bulunamadı' 
      });
    }

    // Kazanılacak puanı hesapla
    const pointsEarned = calculatePointsEarned(amount);
    
    // Kullanıcının puanını güncelle
    const newPointBalance = updatePointBalance(user.points, pointsEarned);
    user.points = newPointBalance;
    await user.save();

    // İşlem kaydı oluştur
    const transaction = await PointTransaction.create({
      user: userId,
      amount: pointsEarned,
      type: 'earn',
      description: description || `${amount} TL tutarında alışveriş için ${pointsEarned} puan kazanıldı.`,
      orderId,
      balanceAfter: newPointBalance,
      status: 'completed',
      metadata: { orderAmount: amount }
    });

    return res.status(201).json({
      success: true,
      data: {
        transaction,
        pointsEarned,
        currentBalance: newPointBalance
      },
      message: `${pointsEarned} puan başarıyla eklendi.`
    });

  } catch (error) {
    console.error('Puan kazanım hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Puan kazanım işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Puan kullanım (ödül alma) endpoint'i
 * @route POST /api/points/redeem
 * @access Private
 */
exports.redeemPoints = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    if (!userId || !rewardId) {
      return res.status(400).json({ 
        success: false,
        message: 'Kullanıcı ID ve ödül ID zorunludur' 
      });
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Kullanıcı bulunamadı' 
      });
    }

    // Ödülü bul
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ 
        success: false,
        message: 'Ödül bulunamadı' 
      });
    }

    // Ödülün aktif olup olmadığını kontrol et
    if (!reward.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'Bu ödül artık mevcut değil' 
      });
    }

    // Ödülün stokta olup olmadığını kontrol et
    if (reward.quantity === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Bu ödül tükenmiştir' 
      });
    }

    // Kullanıcının yeterli puanı olup olmadığını kontrol et
    if (!hasEnoughPoints(user.points, reward.pointCost)) {
      return res.status(400).json({ 
        success: false,
        message: 'Yeterli puanınız bulunmamaktadır' 
      });
    }

    // Kullanıcının puanını güncelle (düş)
    const pointCost = reward.pointCost;
    const newPointBalance = updatePointBalance(user.points, -pointCost);
    user.points = newPointBalance;
    await user.save();

    // Ödül kullanım sayısını artır ve stoğu güncelle
    reward.redemptionCount += 1;
    if (reward.quantity > 0) { // -1 sınırsız anlamına gelir
      reward.quantity -= 1;
    }
    await reward.save();

    // İşlem kaydı oluştur
    const transaction = await PointTransaction.create({
      user: userId,
      amount: -pointCost,
      type: 'redeem',
      description: `"${reward.name}" ödülü için ${pointCost} puan kullanıldı.`,
      reward: rewardId,
      balanceAfter: newPointBalance,
      status: 'completed',
      metadata: { rewardName: reward.name }
    });

    return res.status(200).json({
      success: true,
      data: {
        transaction,
        pointsRedeemed: pointCost,
        currentBalance: newPointBalance,
        reward
      },
      message: `"${reward.name}" ödülü başarıyla alındı.`
    });

  } catch (error) {
    console.error('Puan kullanım hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Puan kullanım işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
};

/**
 * Kullanıcının puan işlem geçmişini getir
 * @route GET /api/points/history/:userId
 * @access Private
 */
exports.getPointHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Kullanıcı ID zorunludur' 
      });
    }

    // Kullanıcının varlığını kontrol et
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        message: 'Kullanıcı bulunamadı' 
      });
    }

    // Toplam kayıt sayısını al (sayfalama için)
    const total = await PointTransaction.countDocuments({ user: userId });

    // İşlem geçmişini al
    const transactions = await PointTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('reward', 'name description pointCost');

    // Kullanıcı bilgilerini al
    const user = await User.findById(userId, 'name email points');

    return res.status(200).json({
      success: true,
      data: {
        user,
        transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('İşlem geçmişi sorgulama hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'İşlem geçmişi sorgulanırken bir hata oluştu',
      error: error.message
    });
  }
}; 