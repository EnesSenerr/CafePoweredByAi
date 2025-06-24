const mongoose = require('mongoose');
require('dotenv').config();

// Model'leri import et
const MenuItem = require('../src/models/MenuItem');
const User = require('../src/models/User');
const StockItem = require('../src/models/StockItem');

// Menü öğeleri ve gerekli malzemeler
const menuItemsData = [
  {
    name: 'Klasik Espresso',
    description: 'Yoğun ve aromatik espresso shot',
    price: 25,
    category: 'Kahve',
    stock: 100,
    preparationTime: 3,
    calories: 10,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Granül Şeker', quantity: 5, unit: 'gram' }
    ]
  },
  {
    name: 'Cappuccino',
    description: 'Espresso, sıcak süt ve süt köpüğü karışımı',
    price: 35,
    category: 'Kahve',
    stock: 100,
    preparationTime: 5,
    calories: 120,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 150, unit: 'ml' },
      { stockItemName: 'Granül Şeker', quantity: 8, unit: 'gram' }
    ]
  },
  {
    name: 'Latte',
    description: 'Espresso ve bol miktarda buharlanmış süt',
    price: 40,
    category: 'Kahve',
    stock: 100,
    preparationTime: 5,
    calories: 190,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 200, unit: 'ml' },
      { stockItemName: 'Granül Şeker', quantity: 10, unit: 'gram' }
    ]
  },
  {
    name: 'Vanilya Latte',
    description: 'Latte\'ye vanilya şurubu eklenerek hazırlanan aromalı kahve',
    price: 45,
    category: 'Kahve',
    stock: 100,
    preparationTime: 6,
    calories: 230,
    isPopular: false,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 200, unit: 'ml' },
      { stockItemName: 'Vanilya Şurubu', quantity: 20, unit: 'ml' },
      { stockItemName: 'Granül Şeker', quantity: 5, unit: 'gram' }
    ]
  },
  {
    name: 'Karamel Macchiato',
    description: 'Vanilya şuruplu süt, espresso ve karamel sos',
    price: 50,
    category: 'Kahve',
    stock: 100,
    preparationTime: 7,
    calories: 280,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 180, unit: 'ml' },
      { stockItemName: 'Vanilya Şurubu', quantity: 15, unit: 'ml' },
      { stockItemName: 'Karamel Şurubu', quantity: 20, unit: 'ml' }
    ]
  },
  {
    name: 'Mocha',
    description: 'Espresso, çikolata şurubu ve süt karışımı',
    price: 45,
    category: 'Kahve',
    stock: 100,
    preparationTime: 6,
    calories: 290,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Espresso Karışımı', quantity: 18, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 180, unit: 'ml' },
      { stockItemName: 'Çikolata Şurubu', quantity: 25, unit: 'ml' },
      { stockItemName: 'Krema', quantity: 30, unit: 'ml' }
    ]
  },
  {
    name: 'Green Power Smoothie',
    description: 'Ispanak, muz, mango ve protein tozu ile hazırlanan sağlıklı smoothie',
    price: 55,
    category: 'İçecek',
    stock: 50,
    preparationTime: 8,
    calories: 320,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Ispanak', quantity: 50, unit: 'gram' },
      { stockItemName: 'Muz', quantity: 1, unit: 'adet' },
      { stockItemName: 'Mango', quantity: 0.5, unit: 'adet' },
      { stockItemName: 'Badem Sütü', quantity: 200, unit: 'ml' },
      { stockItemName: 'Bitki Protein Karışımı', quantity: 25, unit: 'gram' },
      { stockItemName: 'Bal', quantity: 15, unit: 'gram' }
    ]
  },
  {
    name: 'Berry Antioxidant Smoothie',
    description: 'Çilek, yaban mersini ve chia tohumu ile zenginleştirilmiş smoothie',
    price: 60,
    category: 'İçecek',
    stock: 50,
    preparationTime: 8,
    calories: 280,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Çilek', quantity: 150, unit: 'gram' },
      { stockItemName: 'Yaban Mersini', quantity: 100, unit: 'gram' },
      { stockItemName: 'Muz', quantity: 0.5, unit: 'adet' },
      { stockItemName: 'Yulaf Sütü', quantity: 200, unit: 'ml' },
      { stockItemName: 'Chia Tohumu', quantity: 10, unit: 'gram' },
      { stockItemName: 'Bal', quantity: 20, unit: 'gram' }
    ]
  },
  {
    name: 'Tropical Paradise Smoothie',
    description: 'Mango, ananas ve hindistan cevizi ile tropikal lezzet',
    price: 58,
    category: 'İçecek',
    stock: 50,
    preparationTime: 8,
    calories: 260,
    isPopular: false,
    requiredIngredients: [
      { stockItemName: 'Mango', quantity: 0.7, unit: 'adet' },
      { stockItemName: 'Ananas', quantity: 0.3, unit: 'adet' },
      { stockItemName: 'Hindistan Cevizi Yağı', quantity: 10, unit: 'ml' },
      { stockItemName: 'Badem Sütü', quantity: 180, unit: 'ml' },
      { stockItemName: 'Bal', quantity: 15, unit: 'gram' }
    ]
  },
  {
    name: 'Protein Power Bowl Smoothie',
    description: 'Whey protein, badem ve hurma ile güçlü protein karışımı',
    price: 65,
    category: 'İçecek',
    stock: 40,
    preparationTime: 10,
    calories: 380,
    isPopular: false,
    requiredIngredients: [
      { stockItemName: 'Whey Protein (Vanilya)', quantity: 30, unit: 'gram' },
      { stockItemName: 'Badem', quantity: 25, unit: 'gram' },
      { stockItemName: 'Kuru Hurma', quantity: 30, unit: 'gram' },
      { stockItemName: 'Muz', quantity: 1, unit: 'adet' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 200, unit: 'ml' },
      { stockItemName: 'Tarçın', quantity: 2, unit: 'gram' }
    ]
  },
  {
    name: 'Detox Veggie Smoothie',
    description: 'Havuç, pancar ve goji berry ile detoks etkili smoothie',
    price: 52,
    category: 'İçecek',
    stock: 30,
    preparationTime: 9,
    calories: 220,
    isPopular: false,
    requiredIngredients: [
      { stockItemName: 'Havuç', quantity: 100, unit: 'gram' },
      { stockItemName: 'Pancar', quantity: 80, unit: 'gram' },
      { stockItemName: 'Goji Berry', quantity: 15, unit: 'gram' },
      { stockItemName: 'Badem Sütü', quantity: 200, unit: 'ml' },
      { stockItemName: 'Bal', quantity: 18, unit: 'gram' }
    ]
  },
  {
    name: 'Sıcak Çikolata',
    description: 'Kremsi sıcak çikolata, üzerinde krema',
    price: 35,
    category: 'İçecek',
    stock: 80,
    preparationTime: 5,
    calories: 340,
    isPopular: true,
    requiredIngredients: [
      { stockItemName: 'Kakao Tozu', quantity: 25, unit: 'gram' },
      { stockItemName: 'Tam Yağlı Süt', quantity: 250, unit: 'ml' },
      { stockItemName: 'Çikolata Şurubu', quantity: 20, unit: 'ml' },
      { stockItemName: 'Krema', quantity: 40, unit: 'ml' },
      { stockItemName: 'Granül Şeker', quantity: 15, unit: 'gram' }
    ]
  },
  {
    name: 'Energizing Breakfast Bowl',
    description: 'Ceviz, chia tohumu ve kabaklı protein içecek',
    price: 48,
    category: 'Atıştırmalık',
    stock: 25,
    preparationTime: 12,
    calories: 420,
    isPopular: false,
    requiredIngredients: [
      { stockItemName: 'Ceviz', quantity: 30, unit: 'gram' },
      { stockItemName: 'Chia Tohumu', quantity: 15, unit: 'gram' },
      { stockItemName: 'Kabak Çekirdeği', quantity: 20, unit: 'gram' },
      { stockItemName: 'Yulaf Sütü', quantity: 150, unit: 'ml' },
      { stockItemName: 'Bal', quantity: 25, unit: 'gram' },
      { stockItemName: 'Vanilya Özü', quantity: 3, unit: 'ml' }
    ]
  }
];

async function createSampleMenuItems() {
  try {
    // MongoDB bağlantısının zaten kurulu olduğunu varsay

    // Admin kullanıcısını bul
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('Admin kullanıcısı bulunamadı. Önce admin kullanıcısı oluşturun.');
      throw new Error('Admin kullanıcısı bulunamadı');
    }

    // Tüm stok öğelerini getir
    const stockItems = await StockItem.find({});
    const stockMap = {};
    stockItems.forEach(item => {
      stockMap[item.name] = item._id;
    });

    // Mevcut menü öğelerini temizle
    await MenuItem.deleteMany({});
    console.log('Mevcut menü öğeleri temizlendi');

    const menuItems = [];

    for (const itemData of menuItemsData) {
      // Gerekli malzemeleri stok referansları ile dönüştür
      const requiredIngredients = itemData.requiredIngredients.map(ingredient => {
        const stockItemId = stockMap[ingredient.stockItemName];
        if (!stockItemId) {
          console.warn(`Uyarı: ${ingredient.stockItemName} stok öğesi bulunamadı`);
          return null;
        }
        return {
          stockItem: stockItemId,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        };
      }).filter(item => item !== null);

      const menuItem = {
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        category: itemData.category,
        stock: itemData.stock,
        preparationTime: itemData.preparationTime,
        calories: itemData.calories,
        isPopular: itemData.isPopular,
        requiredIngredients: requiredIngredients,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      };

      menuItems.push(menuItem);
    }

    // Menü öğelerini veritabanına ekle
    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`${createdMenuItems.length} menü öğesi eklendi`);

    console.log('Menü öğeleri başarıyla oluşturuldu:');
    createdMenuItems.forEach(item => {
      console.log(`- ${item.name} (${item.category}): ${item.price}₺`);
    });

    // İstatistikleri göster
    const totalItems = await MenuItem.countDocuments();
    const popularItems = await MenuItem.find({ isPopular: true }).countDocuments();
    
    console.log(`\n📊 Menü İstatistikleri:`);
    console.log(`   Toplam öğe: ${totalItems}`);
    console.log(`   Popüler öğe: ${popularItems}`);

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
      
      await createSampleMenuItems();
      
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      await mongoose.disconnect();
      console.log('MongoDB bağlantısı kapatıldı');
    }
  }
  
  run();
}

module.exports = { createSampleMenuItems, menuItemsData }; 