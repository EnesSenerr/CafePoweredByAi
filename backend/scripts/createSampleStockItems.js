const mongoose = require('mongoose');
const StockItem = require('../src/models/StockItem');
require('dotenv').config();

const stockItems = [
  // Kahve Çekirdekleri
  {
    name: 'Arabica Kahve Çekirdekleri',
    category: 'Kahve Çekirdekleri',
    currentStock: 5000,
    minStock: 1000,
    unit: 'gram',
    price: 0.15,
    supplier: 'Premium Coffee Roasters',
    description: 'Yüksek kaliteli Arabica kahve çekirdekleri, orta kavrum'
  },
  {
    name: 'Robusta Kahve Çekirdekleri',
    category: 'Kahve Çekirdekleri',
    currentStock: 3000,
    minStock: 500,
    unit: 'gram',
    price: 0.12,
    supplier: 'Premium Coffee Roasters',
    description: 'Güçlü aromalı Robusta kahve çekirdekleri'
  },
  {
    name: 'Espresso Karışımı',
    category: 'Kahve Çekirdekleri',
    currentStock: 2500,
    minStock: 500,
    unit: 'gram',
    price: 0.18,
    supplier: 'Premium Coffee Roasters',
    description: 'Özel espresso karışımı, yoğun tat'
  },

  // Süt Ürünleri
  {
    name: 'Tam Yağlı Süt',
    category: 'Süt Ürünleri',
    currentStock: 50,
    minStock: 10,
    unit: 'litre',
    price: 5.50,
    supplier: 'Local Dairy Farm',
    description: 'Taze tam yağlı inek sütü'
  },
  {
    name: 'Badem Sütü',
    category: 'Süt Ürünleri',
    currentStock: 20,
    minStock: 5,
    unit: 'litre',
    price: 8.00,
    supplier: 'Plant-Based Co.',
    description: 'Organik badem sütü, şekersiz'
  },
  {
    name: 'Yulaf Sütü',
    category: 'Süt Ürünleri',
    currentStock: 15,
    minStock: 5,
    unit: 'litre',
    price: 7.50,
    supplier: 'Plant-Based Co.',
    description: 'Kremsi yulaf sütü'
  },
  {
    name: 'Krema',
    category: 'Süt Ürünleri',
    currentStock: 8,
    minStock: 2,
    unit: 'litre',
    price: 12.00,
    supplier: 'Dairy Plus',
    description: '%35 yağlı krema'
  },

  // Şeker ve Tatlandırıcılar
  {
    name: 'Granül Şeker',
    category: 'Şeker ve Tatlandırıcılar',
    currentStock: 10000,
    minStock: 2000,
    unit: 'gram',
    price: 0.008,
    supplier: 'Sugar Corp',
    description: 'Beyaz granül şeker'
  },
  {
    name: 'Kahverengi Şeker',
    category: 'Şeker ve Tatlandırıcılar',
    currentStock: 5000,
    minStock: 1000,
    unit: 'gram',
    price: 0.012,
    supplier: 'Natural Sugars Ltd',
    description: 'Ham kahverengi şeker'
  },
  {
    name: 'Bal',
    category: 'Şeker ve Tatlandırıcılar',
    currentStock: 2000,
    minStock: 300,
    unit: 'gram',
    price: 0.025,
    supplier: 'Mountain Honey',
    description: 'Doğal çiçek balı'
  },
  {
    name: 'Stevia',
    category: 'Şeker ve Tatlandırıcılar',
    currentStock: 500,
    minStock: 100,
    unit: 'gram',
    price: 0.08,
    supplier: 'Natural Sweeteners',
    description: 'Doğal stevia ekstraklı tatlandırıcı'
  },

  // Meyveler
  {
    name: 'Muz',
    category: 'Meyveler',
    currentStock: 50,
    minStock: 10,
    unit: 'adet',
    price: 1.50,
    supplier: 'Fresh Fruits Market',
    description: 'Taze muz, smoothie için ideal'
  },
  {
    name: 'Çilek',
    category: 'Meyveler',
    currentStock: 3000,
    minStock: 500,
    unit: 'gram',
    price: 0.015,
    supplier: 'Berry Farm',
    description: 'Taze çilek'
  },
  {
    name: 'Yaban Mersini',
    category: 'Meyveler',
    currentStock: 2000,
    minStock: 300,
    unit: 'gram',
    price: 0.025,
    supplier: 'Berry Farm',
    description: 'Antioksidan açısından zengin yaban mersini'
  },
  {
    name: 'Mango',
    category: 'Meyveler',
    currentStock: 20,
    minStock: 5,
    unit: 'adet',
    price: 4.00,
    supplier: 'Tropical Fruits',
    description: 'Olgun tropikal mango'
  },
  {
    name: 'Ananas',
    category: 'Meyveler',
    currentStock: 15,
    minStock: 3,
    unit: 'adet',
    price: 8.00,
    supplier: 'Tropical Fruits',
    description: 'Tatlı ananas'
  },

  // Sebzeler
  {
    name: 'Ispanak',
    category: 'Sebzeler',
    currentStock: 1500,
    minStock: 200,
    unit: 'gram',
    price: 0.012,
    supplier: 'Green Garden',
    description: 'Taze bebek ıspanak yaprakları'
  },
  {
    name: 'Havuç',
    category: 'Sebzeler',
    currentStock: 2000,
    minStock: 300,
    unit: 'gram',
    price: 0.008,
    supplier: 'Vegetable Co.',
    description: 'Organik havuç'
  },
  {
    name: 'Pancar',
    category: 'Sebzeler',
    currentStock: 1000,
    minStock: 200,
    unit: 'gram',
    price: 0.010,
    supplier: 'Root Vegetables Ltd',
    description: 'Taze kırmızı pancar'
  },

  // Baharat ve Çeşniler
  {
    name: 'Vanilya Özü',
    category: 'Baharat ve Çeşniler',
    currentStock: 500,
    minStock: 50,
    unit: 'ml',
    price: 0.20,
    supplier: 'Spice Masters',
    description: 'Doğal vanilya ekstraklı aroma'
  },
  {
    name: 'Tarçın',
    category: 'Baharat ve Çeşniler',
    currentStock: 200,
    minStock: 50,
    unit: 'gram',
    price: 0.15,
    supplier: 'Spice World',
    description: 'Ceylon tarçın tozu'
  },
  {
    name: 'Kakao Tozu',
    category: 'Baharat ve Çeşniler',
    currentStock: 1000,
    minStock: 200,
    unit: 'gram',
    price: 0.035,
    supplier: 'Chocolate Co.',
    description: 'Premium kakao tozu'
  },
  {
    name: 'Hindistan Cevizi Yağı',
    category: 'Baharat ve Çeşniler',
    currentStock: 800,
    minStock: 150,
    unit: 'ml',
    price: 0.025,
    supplier: 'Coconut Products',
    description: 'Virgin hindistan cevizi yağı'
  },

  // Protein Tozları
  {
    name: 'Whey Protein (Vanilya)',
    category: 'Protein Tozları',
    currentStock: 2000,
    minStock: 300,
    unit: 'gram',
    price: 0.08,
    supplier: 'Fitness Supplements',
    description: 'Yüksek kaliteli whey protein tozu'
  },
  {
    name: 'Bitki Protein Karışımı',
    category: 'Protein Tozları',
    currentStock: 1500,
    minStock: 250,
    unit: 'gram',
    price: 0.10,
    supplier: 'Plant Power',
    description: 'Bezelye ve pirinç protein karışımı'
  },

  // Şuruplar
  {
    name: 'Vanilya Şurubu',
    category: 'Şuruplar',
    currentStock: 2000,
    minStock: 300,
    unit: 'ml',
    price: 0.02,
    supplier: 'Flavor House',
    description: 'Premium vanilya aromalı şurup'
  },
  {
    name: 'Karamel Şurubu',
    category: 'Şuruplar',
    currentStock: 1800,
    minStock: 300,
    unit: 'ml',
    price: 0.022,
    supplier: 'Flavor House',
    description: 'Kremsi karamel şurubu'
  },
  {
    name: 'Çikolata Şurubu',
    category: 'Şuruplar',
    currentStock: 1500,
    minStock: 250,
    unit: 'ml',
    price: 0.025,
    supplier: 'Chocolate Co.',
    description: 'Yoğun çikolata şurubu'
  },

  // Kuru Meyveler
  {
    name: 'Kuru Hurma',
    category: 'Kuru Meyveler',
    currentStock: 1000,
    minStock: 200,
    unit: 'gram',
    price: 0.035,
    supplier: 'Dried Fruits Co.',
    description: 'Çekirdeksiz Medjool hurma'
  },
  {
    name: 'Goji Berry',
    category: 'Kuru Meyveler',
    currentStock: 500,
    minStock: 100,
    unit: 'gram',
    price: 0.08,
    supplier: 'Superfood Store',
    description: 'Organik goji berry'
  },

  // Fındık ve Tohum
  {
    name: 'Badem',
    category: 'Fındık ve Tohum',
    currentStock: 2000,
    minStock: 300,
    unit: 'gram',
    price: 0.045,
    supplier: 'Nut Company',
    description: 'Ham Amerikan bademi'
  },
  {
    name: 'Ceviz',
    category: 'Fındık ve Tohum',
    currentStock: 1500,
    minStock: 250,
    unit: 'gram',
    price: 0.055,
    supplier: 'Nut Company',
    description: 'Taze ceviz içi'
  },
  {
    name: 'Chia Tohumu',
    category: 'Fındık ve Tohum',
    currentStock: 800,
    minStock: 150,
    unit: 'gram',
    price: 0.06,
    supplier: 'Seeds & Grains',
    description: 'Organik chia tohumu'
  },
  {
    name: 'Kabak Çekirdeği',
    category: 'Fındık ve Tohum',
    currentStock: 600,
    minStock: 100,
    unit: 'gram',
    price: 0.04,
    supplier: 'Seeds & Grains',
    description: 'Kavrulmuş kabak çekirdeği'
  }
];

async function createSampleStockItems() {
  try {
    // MongoDB bağlantısının zaten kurulu olduğunu varsay
    
    // Mevcut stok öğelerini temizle
    await StockItem.deleteMany({});
    console.log('Mevcut stok öğeleri temizlendi');

    // Yeni stok öğelerini ekle
    const createdStockItems = await StockItem.insertMany(stockItems);
    console.log(`${createdStockItems.length} stok öğesi eklendi`);

    console.log('Stok öğeleri başarıyla oluşturuldu:');
    createdStockItems.forEach(item => {
      console.log(`- ${item.name} (${item.category}): ${item.currentStock} ${item.unit}`);
    });

  } catch (error) {
    console.error('Hata:', error);
    throw error; // Hatayı üst seviyeye ilet
  }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
  async function run() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB bağlantısı kuruldu');
      
      await createSampleStockItems();
      
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      await mongoose.disconnect();
      console.log('MongoDB bağlantısı kapatıldı');
    }
  }
  
  run();
}

module.exports = { createSampleStockItems, stockItems }; 