/**
 * Harcama tutarına göre kazanılacak puan miktarını hesaplar
 * @param {number} amount - Harcama tutarı (TL)
 * @param {number} [rate=0.1] - Puan kazanım oranı (varsayılan: her 1 TL için 0.1 puan)
 * @returns {number} - Kazanılan puan miktarı
 */
const calculatePointsEarned = (amount, rate = 0.1) => {
  if (amount <= 0) return 0;
  return Math.floor(amount * rate);
};

/**
 * Kullanıcının belirli bir ödül için yeterli puanı olup olmadığını kontrol eder
 * @param {number} userPoints - Kullanıcının mevcut puanı
 * @param {number} rewardCost - Ödülün puan maliyeti
 * @returns {boolean} - Kullanıcının yeterli puanı varsa true, yoksa false
 */
const hasEnoughPoints = (userPoints, rewardCost) => {
  return userPoints >= rewardCost;
};

/**
 * Kullanıcının puan bakiyesini günceller (puan ekler veya çıkarır)
 * @param {number} currentPoints - Kullanıcının mevcut puanı
 * @param {number} amount - Eklenecek veya çıkarılacak puan miktarı (negatif değer puan düşümünü ifade eder)
 * @returns {number} - Güncellenmiş puan bakiyesi
 */
const updatePointBalance = (currentPoints, amount) => {
  const newBalance = currentPoints + amount;
  return newBalance < 0 ? 0 : newBalance;
};

/**
 * Puan geçerliliği kontrolü (gelecekte tarih bazlı geçerlilik için genişletilebilir)
 * @param {Object} transaction - Puan işlemi
 * @returns {boolean} - Puanlar geçerliyse true, değilse false
 */
const arePointsValid = (transaction) => {
  // Şu an için basit bir kontrol. İleride tarih/durum kontrolleri eklenebilir
  return transaction && transaction.status === 'completed';
};

module.exports = {
  calculatePointsEarned,
  hasEnoughPoints,
  updatePointBalance,
  arePointsValid
}; 