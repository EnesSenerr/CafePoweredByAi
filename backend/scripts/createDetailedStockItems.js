const mongoose = require('mongoose');
const StockItem = require('../src/models/StockItem');
require('dotenv').config();

const stockItems = [
  // Kahve Çekirdekleri
  { name: 'Arabica Kahve Çekirdekleri', category: 'Kahve Çekirdekleri', currentStock: 5000, minStock: 1000, unit: 'gram', price: 0.45, supplier: 'Premium Coffee Roasters', description: 'Yüksek kaliteli Arabica kahve çekirdekleri, orta kavrum' },
  { name: 'Robusta Kahve Çekirdekleri', category: 'Kahve Çekirdekleri', currentStock: 3000, minStock: 500, unit: 'gram', price: 0.38, supplier: 'Premium Coffee Roasters', description: 'Güçlü aromalı Robusta kahve çekirdekleri' },
  { name: 'Espresso Karışımı', category: 'Kahve Çekirdekleri', currentStock: 2500, minStock: 500, unit: 'gram', price: 0.52, supplier: 'Premium Coffee Roasters', description: 'Özel espresso karışımı, yoğun tat' },
  { name: 'Filtre Kahve', category: 'Kahve Çekirdekleri', currentStock: 4000, minStock: 800, unit: 'gram', price: 0.40, supplier: 'Filter Coffee Ltd.', description: 'Klasik filtre kahve çekirdeği' },

  // Süt Ürünleri
  { name: 'Tam Yağlı Süt', category: 'Süt Ürünleri', currentStock: 80, minStock: 20, unit: 'litre', price: 22.00, supplier: 'Local Dairy Farm', description: 'Taze tam yağlı inek sütü' },
  { name: 'Badem Sütü', category: 'Süt Ürünleri', currentStock: 30, minStock: 8, unit: 'litre', price: 38.00, supplier: 'Plant-Based Co.', description: 'Organik badem sütü, şekersiz' },
  { name: 'Yulaf Sütü', category: 'Süt Ürünleri', currentStock: 25, minStock: 8, unit: 'litre', price: 32.00, supplier: 'Plant-Based Co.', description: 'Kremsi yulaf sütü' },
  { name: 'Krema', category: 'Süt Ürünleri', currentStock: 12, minStock: 3, unit: 'litre', price: 55.00, supplier: 'Dairy Plus', description: '%35 yağlı krema' },
  { name: 'Labne', category: 'Süt Ürünleri', currentStock: 10, minStock: 2, unit: 'kg', price: 120.00, supplier: 'Cheese Masters', description: 'Taze labne peyniri' },
  { name: 'Beyaz Peynir', category: 'Süt Ürünleri', currentStock: 15, minStock: 3, unit: 'kg', price: 110.00, supplier: 'Cheese Masters', description: 'Klasik beyaz peynir' },
  { name: 'Kaşar Peyniri', category: 'Süt Ürünleri', currentStock: 10, minStock: 2, unit: 'kg', price: 140.00, supplier: 'Cheese Masters', description: 'Taze kaşar peyniri' },

  // Şeker ve Tatlandırıcılar
  { name: 'Granül Şeker', category: 'Şeker ve Tatlandırıcılar', currentStock: 12000, minStock: 2500, unit: 'gram', price: 0.025, supplier: 'Sugar Corp', description: 'Beyaz granül şeker' },
  { name: 'Kahverengi Şeker', category: 'Şeker ve Tatlandırıcılar', currentStock: 6000, minStock: 1200, unit: 'gram', price: 0.032, supplier: 'Natural Sugars Ltd', description: 'Ham kahverengi şeker' },
  { name: 'Bal', category: 'Şeker ve Tatlandırıcılar', currentStock: 2500, minStock: 400, unit: 'gram', price: 0.085, supplier: 'Mountain Honey', description: 'Doğal çiçek balı' },
  { name: 'Stevia', category: 'Şeker ve Tatlandırıcılar', currentStock: 700, minStock: 150, unit: 'gram', price: 0.18, supplier: 'Natural Sweeteners', description: 'Doğal stevia ekstraktlı tatlandırıcı' },
  { name: 'Karamel', category: 'Şeker ve Tatlandırıcılar', currentStock: 800, minStock: 200, unit: 'gram', price: 0.12, supplier: 'Sweet Toppings', description: 'Karamel sos' },

  // Meyveler
  { name: 'Muz', category: 'Meyveler', currentStock: 80, minStock: 15, unit: 'adet', price: 6.00, supplier: 'Fresh Fruits Market', description: 'Taze muz, smoothie için ideal' },
  { name: 'Çilek', category: 'Meyveler', currentStock: 4000, minStock: 700, unit: 'gram', price: 0.045, supplier: 'Berry Farm', description: 'Taze çilek' },
  { name: 'Yaban Mersini', category: 'Meyveler', currentStock: 2500, minStock: 400, unit: 'gram', price: 0.085, supplier: 'Berry Farm', description: 'Antioksidan açısından zengin yaban mersini' },
  { name: 'Mango', category: 'Meyveler', currentStock: 30, minStock: 7, unit: 'adet', price: 18.00, supplier: 'Tropical Fruits', description: 'Olgun tropikal mango' },
  { name: 'Ananas', category: 'Meyveler', currentStock: 20, minStock: 5, unit: 'adet', price: 28.00, supplier: 'Tropical Fruits', description: 'Tatlı ananas' },
  { name: 'Elma', category: 'Meyveler', currentStock: 60, minStock: 10, unit: 'adet', price: 5.00, supplier: 'Fresh Fruits Market', description: 'Taze elma' },
  { name: 'Frambuaz', category: 'Meyveler', currentStock: 1200, minStock: 200, unit: 'gram', price: 0.12, supplier: 'Berry Farm', description: 'Taze frambuaz' },

  // Sebzeler
  { name: 'Ispanak', category: 'Sebzeler', currentStock: 2000, minStock: 300, unit: 'gram', price: 0.035, supplier: 'Green Garden', description: 'Taze bebek ıspanak yaprakları' },
  { name: 'Havuç', category: 'Sebzeler', currentStock: 2500, minStock: 400, unit: 'gram', price: 0.022, supplier: 'Vegetable Co.', description: 'Organik havuç' },
  { name: 'Pancar', category: 'Sebzeler', currentStock: 1200, minStock: 250, unit: 'gram', price: 0.030, supplier: 'Root Vegetables Ltd', description: 'Taze kırmızı pancar' },
  { name: 'Salatalık', category: 'Sebzeler', currentStock: 60, minStock: 10, unit: 'adet', price: 4.00, supplier: 'Green Garden', description: 'Taze salatalık' },
  { name: 'Domates', category: 'Sebzeler', currentStock: 70, minStock: 12, unit: 'adet', price: 5.00, supplier: 'Green Garden', description: 'Taze domates' },
  { name: 'Biber', category: 'Sebzeler', currentStock: 50, minStock: 10, unit: 'adet', price: 6.00, supplier: 'Green Garden', description: 'Taze biber' },

  // Baharat ve Çeşniler
  { name: 'Vanilya Özütü', category: 'Baharat ve Çeşniler', currentStock: 700, minStock: 100, unit: 'ml', price: 0.65, supplier: 'Spice Masters', description: 'Doğal vanilya ekstraktlı aroma' },
  { name: 'Tarçın', category: 'Baharat ve Çeşniler', currentStock: 300, minStock: 70, unit: 'gram', price: 0.45, supplier: 'Spice World', description: 'Ceylon tarçın tozu' },
  { name: 'Kakao Tozu', category: 'Baharat ve Çeşniler', currentStock: 1500, minStock: 300, unit: 'gram', price: 0.18, supplier: 'Chocolate Co.', description: 'Premium kakao tozu' },
  { name: 'Hindistan Cevizi Yağı', category: 'Baharat ve Çeşniler', currentStock: 1000, minStock: 200, unit: 'ml', price: 0.22, supplier: 'Coconut Products', description: 'Virgin hindistan cevizi yağı' },
  { name: 'Susam', category: 'Baharat ve Çeşniler', currentStock: 800, minStock: 150, unit: 'gram', price: 0.09, supplier: 'Spice Masters', description: 'Taze susam' },
  { name: 'Pekmez', category: 'Baharat ve Çeşniler', currentStock: 400, minStock: 80, unit: 'ml', price: 0.28, supplier: 'Spice Masters', description: 'Üzüm pekmezi' },

  // Protein ve Vegan Ürünler
  { name: 'Whey Protein (Vanilya)', category: 'Protein Tozları', currentStock: 60, minStock: 10, unit: 'gram', price: 1.20, supplier: 'Protein World', description: 'Vanilya aromalı whey protein' },
  { name: 'Bitki Protein Karışımı', category: 'Protein Tozları', currentStock: 80, minStock: 15, unit: 'gram', price: 1.10, supplier: 'Vegan Nutrition', description: 'Bitkisel protein karışımı' },
  { name: 'Badem Unu', category: 'Diğer', currentStock: 300, minStock: 60, unit: 'gram', price: 0.55, supplier: 'Vegan Nutrition', description: 'Glutensiz badem unu' },
  { name: 'Hurme', category: 'Diğer', currentStock: 400, minStock: 80, unit: 'gram', price: 0.22, supplier: 'Vegan Nutrition', description: 'Doğal hurma' },
  { name: 'Ceviz', category: 'Diğer', currentStock: 200, minStock: 40, unit: 'gram', price: 0.60, supplier: 'Vegan Nutrition', description: 'Taze ceviz' },
  { name: 'Vegan Labne', category: 'Diğer', currentStock: 20, minStock: 5, unit: 'kg', price: 140.00, supplier: 'Vegan Nutrition', description: 'Bitkisel labne peyniri' },
  { name: 'Chia Tohumu', category: 'Diğer', currentStock: 150, minStock: 30, unit: 'gram', price: 0.35, supplier: 'Vegan Nutrition', description: 'Omega-3 kaynağı chia tohumu' },
  { name: 'Nohut', category: 'Diğer', currentStock: 500, minStock: 100, unit: 'gram', price: 0.18, supplier: 'Vegan Nutrition', description: 'Protein kaynağı nohut' },
  { name: 'Tahin', category: 'Diğer', currentStock: 100, minStock: 20, unit: 'gram', price: 0.28, supplier: 'Vegan Nutrition', description: 'Susamdan üretilmiş tahin' },

  // Diğer
  { name: 'Çay', category: 'Diğer', currentStock: 2000, minStock: 400, unit: 'gram', price: 0.06, supplier: 'Tea Masters', description: 'Klasik siyah çay' },
  { name: 'Bitki Çayı', category: 'Diğer', currentStock: 800, minStock: 150, unit: 'gram', price: 0.18, supplier: 'Tea Masters', description: 'Nane-limon, adaçayı, papatya karışımı' },
  { name: 'Soda', category: 'Diğer', currentStock: 300, minStock: 60, unit: 'adet', price: 5.00, supplier: 'Soda Co.', description: 'Doğal maden suyu' },
  { name: 'Portakal', category: 'Diğer', currentStock: 60, minStock: 10, unit: 'adet', price: 7.00, supplier: 'Fresh Fruits Market', description: 'Taze portakal' },
  { name: 'Bisküvi', category: 'Diğer', currentStock: 200, minStock: 40, unit: 'gram', price: 0.15, supplier: 'Snack World', description: 'Klasik bisküvi' },
  { name: 'Yumurta', category: 'Diğer', currentStock: 120, minStock: 20, unit: 'adet', price: 4.00, supplier: 'Egg Farm', description: 'Taze yumurta' },
  { name: 'Un', category: 'Diğer', currentStock: 3000, minStock: 600, unit: 'gram', price: 0.025, supplier: 'Flour Mills', description: 'Çok amaçlı un' },
  { name: 'Zeytinyağı', category: 'Diğer', currentStock: 100, minStock: 20, unit: 'ml', price: 0.30, supplier: 'Olive Oil Co.', description: 'Soğuk sıkım zeytinyağı' },
  { name: 'Marul', category: 'Diğer', currentStock: 30, minStock: 6, unit: 'adet', price: 6.00, supplier: 'Green Garden', description: 'Taze marul' },
  { name: 'Mısır', category: 'Diğer', currentStock: 500, minStock: 100, unit: 'gram', price: 0.12, supplier: 'Vegetable Co.', description: 'Tatlı mısır' },
  { name: 'Baget Ekmeği', category: 'Diğer', currentStock: 40, minStock: 8, unit: 'adet', price: 8.00, supplier: 'Bakery House', description: 'Taze baget ekmeği' },
  { name: 'Tam Buğday Ekmeği', category: 'Diğer', currentStock: 30, minStock: 6, unit: 'adet', price: 10.00, supplier: 'Bakery House', description: 'Lifli tam buğday ekmeği' },
  { name: 'Tortilla', category: 'Diğer', currentStock: 50, minStock: 10, unit: 'adet', price: 7.00, supplier: 'Bakery House', description: 'Taze tortilla ekmeği' },
  { name: 'Humus', category: 'Diğer', currentStock: 20, minStock: 5, unit: 'kg', price: 60.00, supplier: 'Vegan Nutrition', description: 'Nohut ve tahin ile yapılan humus' },
  { name: 'Reçel', category: 'Diğer', currentStock: 30, minStock: 6, unit: 'kg', price: 45.00, supplier: 'Jam World', description: 'Çeşitli meyve reçelleri' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await StockItem.deleteMany({});
  for (const item of stockItems) {
    await new StockItem({ ...item, createdAt: new Date(), updatedAt: new Date(), isActive: true }).save();
  }
  await mongoose.disconnect();
  console.log('Detaylı stok ürünleri eklendi!');
}

run(); 