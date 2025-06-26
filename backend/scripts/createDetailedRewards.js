const mongoose = require('mongoose');
const Reward = require('../src/models/Reward');
require('dotenv').config();

const now = new Date();
const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

const rewards = [
  { name: 'Ücretsiz Americano', description: 'Bir adet Americano kahve ücretsiz!', pointCost: 120, category: 'içecek', isActive: true, quantity: 100, redemptionCount: 12, expiryDate: addDays(30) },
  { name: '%20 İndirim - Tüm Menü', description: 'Tüm menüde %20 indirim fırsatı.', pointCost: 200, category: 'indirim', isActive: true, quantity: 50, redemptionCount: 8, expiryDate: addDays(15) },
  { name: 'Ücretsiz Kurabiye', description: 'El yapımı kurabiyelerimizden birini ücretsiz tadın!', pointCost: 60, category: 'yiyecek', isActive: true, quantity: 75, redemptionCount: 25, expiryDate: addDays(7) },
  { name: '10₺ İndirim', description: 'Siparişinizde 10₺ indirim! Minimum 50₺ alışverişte geçerli.', pointCost: 80, category: 'indirim', isActive: true, quantity: 60, redemptionCount: 5, expiryDate: addDays(10) },
  { name: 'Ücretsiz Cappuccino', description: 'Köpüklü cappuccino keyfi tamamen bedava!', pointCost: 140, category: 'içecek', isActive: true, quantity: 40, redemptionCount: 15, expiryDate: addDays(20) },
  { name: 'Ücretsiz Sandviç', description: 'Taze sandviçlerimizden birini ücretsiz al!', pointCost: 220, category: 'yiyecek', isActive: true, quantity: 30, redemptionCount: 3, expiryDate: addDays(14) },
  { name: '%15 İndirim - Soğuk İçecekler', description: 'Tüm soğuk içeceklerde %15 indirim!', pointCost: 90, category: 'indirim', isActive: true, quantity: 80, redemptionCount: 20, expiryDate: addDays(21) },
  { name: 'Ücretsiz Muffin', description: 'Taze pişmiş muffinlerimizden birini ücretsiz al!', pointCost: 70, category: 'yiyecek', isActive: true, quantity: 65, redemptionCount: 30, expiryDate: addDays(12) },
  { name: '5₺ İndirim - Kahve', description: 'Tüm kahve çeşitlerinde 5₺ indirim!', pointCost: 50, category: 'indirim', isActive: true, quantity: 90, redemptionCount: 45, expiryDate: addDays(5) },
  { name: 'VIP Özel Menü', description: 'VIP müşterilere özel ücretsiz ürün! Günlük sınırlı sayıda.', pointCost: 350, category: 'özel', isActive: true, quantity: 10, redemptionCount: 1, expiryDate: addDays(7) },
  { name: 'Ücretsiz Latte', description: 'Bir adet Latte ücretsiz!', pointCost: 130, category: 'içecek', isActive: true, quantity: 80, redemptionCount: 10, expiryDate: addDays(18) },
  { name: 'Ücretsiz Brownie', description: 'Çikolatalı brownie ücretsiz!', pointCost: 75, category: 'yiyecek', isActive: true, quantity: 60, redemptionCount: 8, expiryDate: addDays(10) },
  { name: 'Ücretsiz Vegan Tatlı', description: 'Vegan tatlılarımızdan birini ücretsiz dene!', pointCost: 100, category: 'vegan', isActive: true, quantity: 30, redemptionCount: 4, expiryDate: addDays(14) },
  { name: 'Ücretsiz Smoothie', description: 'Bir adet smoothie ücretsiz!', pointCost: 110, category: 'içecek', isActive: true, quantity: 50, redemptionCount: 7, expiryDate: addDays(10) },
  { name: 'Kahvaltı Tabağı %25 İndirim', description: 'Kahvaltı tabağında %25 indirim!', pointCost: 180, category: 'indirim', isActive: true, quantity: 20, redemptionCount: 2, expiryDate: addDays(12) },
  { name: 'Ücretsiz Çay', description: 'Bir bardak klasik Türk çayı ücretsiz!', pointCost: 30, category: 'içecek', isActive: true, quantity: 200, redemptionCount: 60, expiryDate: addDays(30) },
  { name: 'Glutensiz Kurabiye Hediye', description: 'Glutensiz kurabiyelerimizden birini ücretsiz al!', pointCost: 60, category: 'vegan', isActive: true, quantity: 40, redemptionCount: 6, expiryDate: addDays(8) },
  { name: 'Vegan Sandviç %20 İndirim', description: 'Vegan sandviçlerde %20 indirim!', pointCost: 90, category: 'vegan', isActive: true, quantity: 25, redemptionCount: 3, expiryDate: addDays(10) },
  { name: 'Ücretsiz Soda', description: 'Bir şişe doğal maden suyu ücretsiz!', pointCost: 25, category: 'içecek', isActive: true, quantity: 100, redemptionCount: 20, expiryDate: addDays(20) },
  { name: 'Tatlılarda %10 İndirim', description: 'Tüm tatlılarda %10 indirim!', pointCost: 60, category: 'indirim', isActive: true, quantity: 70, redemptionCount: 10, expiryDate: addDays(15) },
  { name: 'Ücretsiz Kinoa Salata', description: 'Bir adet kinoa salata ücretsiz!', pointCost: 150, category: 'yiyecek', isActive: true, quantity: 20, redemptionCount: 2, expiryDate: addDays(10) },
  { name: 'Sürpriz Hediye', description: 'Sürpriz bir ürün ücretsiz!', pointCost: 80, category: 'özel', isActive: false, quantity: 0, redemptionCount: 0, expiryDate: addDays(1) },
].map(r => ({ ...r, category: r.category === 'vegan' ? 'diğer' : r.category }));

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Reward.deleteMany({});
  for (const reward of rewards) {
    await new Reward({ ...reward, createdAt: new Date(), updatedAt: new Date() }).save();
  }
  await mongoose.disconnect();
  console.log('Detaylı ödül verileri eklendi!');
}

run(); 