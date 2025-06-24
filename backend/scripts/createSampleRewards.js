const mongoose = require('mongoose');
require('dotenv').config();

// Reward schema (model importu)
const Reward = require('../src/models/Reward');

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Sample rewards data
const sampleRewards = [
  {
    name: 'Ücretsiz Americano',
    description: 'Sevdiğiniz Americano kahve tamamen ücretsiz! Günün herhangi bir saatinde kullanabilirsiniz.',
    pointCost: 50,
    category: 'içecek',
    isActive: true,
    quantity: 100,
    redemptionCount: 12,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün sonra
  },
  {
    name: '%20 İndirim - Tüm Menü',
    description: 'Tüm menü ürünlerinde %20 indirim fırsatı. Kahveden tatlıya kadar her şey dahil!',
    pointCost: 80,
    category: 'indirim',
    isActive: true,
    quantity: 50,
    redemptionCount: 8,
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 gün sonra
  },
  {
    name: 'Ücretsiz Kurabiye',
    description: 'El yapımı özel kurabiyelerimizden birini ücretsiz tadın! Çeşitlerimiz arasından seçim yapabilirsiniz.',
    pointCost: 30,
    category: 'yiyecek',
    isActive: true,
    quantity: 75,
    redemptionCount: 25,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 gün sonra
  },
  {
    name: '10₺ İndirim',
    description: 'Siparişinizde 10₺ indirim! Minimum 25₺ alışverişte geçerlidir.',
    pointCost: 40,
    category: 'indirim',
    isActive: true,
    quantity: 60,
    redemptionCount: 5,
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 gün sonra
  },
  {
    name: 'Ücretsiz Cappuccino',
    description: 'Köpüklü cappuccino keyfi tamamen bedava! En sevilen kahvelerimizden biri.',
    pointCost: 60,
    category: 'içecek',
    isActive: true,
    quantity: 40,
    redemptionCount: 15,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 gün sonra
  },
  {
    name: 'Ücretsiz Sandviç',
    description: 'Taze malzemelerle hazırlanan sandviçlerimizden birini ücretsiz alın!',
    pointCost: 100,
    category: 'yiyecek',
    isActive: true,
    quantity: 30,
    redemptionCount: 3,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 gün sonra
  },
  {
    name: '%15 İndirim - Soğuk İçecekler',
    description: 'Tüm soğuk içeceklerimizde %15 indirim! Yaz serinliği için ideal.',
    pointCost: 45,
    category: 'indirim',
    isActive: true,
    quantity: 80,
    redemptionCount: 20,
    expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 gün sonra
  },
  {
    name: 'Ücretsiz Muffin',
    description: 'Taze pişmiş muffinlerimizden birini ücretsiz alın! Çikolatalı, muzlu ve daha fazlası.',
    pointCost: 35,
    category: 'yiyecek',
    isActive: true,
    quantity: 65,
    redemptionCount: 30,
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 gün sonra
  },
  {
    name: '5₺ İndirim - Kahve',
    description: 'Tüm kahve çeşitlerinde 5₺ indirim fırsatı!',
    pointCost: 25,
    category: 'indirim',
    isActive: true,
    quantity: 90,
    redemptionCount: 45,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 gün sonra
  },
  {
    name: 'VIP Özel Menü',
    description: 'Sadece VIP müşteriler için hazırlanan özel menüden ücretsiz ürün! Günlük sınırlı sayıda.',
    pointCost: 150,
    category: 'özel',
    isActive: true,
    quantity: 10,
    redemptionCount: 1,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 gün sonra
  }
];

const createSampleRewards = async () => {
  try {
    await connectDB();
    
    // Önce mevcut rewards'ları temizle
    await Reward.deleteMany({});
    console.log('Mevcut ödüller temizlendi');
    
    // Yeni rewards'ları ekle
    const createdRewards = await Reward.insertMany(sampleRewards);
    console.log(`${createdRewards.length} ödül başarıyla eklendi`);
    
    // Eklenen ödülleri listele
    console.log('\nEklenen Ödüller:');
    createdRewards.forEach((reward, index) => {
      console.log(`${index + 1}. ${reward.name} - ${reward.pointCost} puan (${reward.category})`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nVeritabanı bağlantısı kapatıldı');
  }
};

// Scripti çalıştır
createSampleRewards(); 