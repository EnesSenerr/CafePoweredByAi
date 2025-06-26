const RecommendationService = require('../services/recommendationService');

exports.getCollaborativeRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 6 } = req.query;
    const recommendations = await RecommendationService.getUserBasedRecommendations(userId, parseInt(limit));
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Öneriler getirilirken hata oluştu',
      error: error.message
    });
  }
}; 