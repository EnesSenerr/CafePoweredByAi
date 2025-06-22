const mongoose = require('mongoose');
require('dotenv').config();

// Model'leri import et
const MenuItem = require('../src/models/MenuItem');
const User = require('../src/models/User');

async function createSampleMenuItems() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(process.env.MONGODB_URI);

    // Admin kullanıcıyı bul
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('Admin kullanıcı bulunamadı. Önce createTestUsers.js çalıştırın.');
      process.exit(1);
    }

    console.log('Admin kullanıcı bulundu:', adminUser.name);

    // Mevcut menü öğelerini temizle
    await MenuItem.deleteMany({});
    console.log('Mevcut menü öğeleri temizlendi');

    // Demo menü öğeleri
    const menuItems = [
      // KAHVE KATEGORİSİ
      {
        name: 'Americano',
        description: 'Sade espresso üzerine sıcak su eklenerek hazırlanır. Saf kahve tadının keyfini çıkarın.',
        price: 25.50,
        category: 'Kahve',
        available: true,
        stock: 100,
        image: '/images/menu/americano.jpg',
        ingredients: ['Espresso', 'Sıcak su'],
        allergens: ['Kafein'],
        calories: 5,
        preparationTime: 3,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Cappuccino',
        description: 'Espresso, buharda ısıtılmış süt ve süt köpüğünün mükemmel harmonisi.',
        price: 28.00,
        category: 'Kahve',
        available: true,
        stock: 85,
        image: '/images/menu/cappuccino.jpg',
        ingredients: ['Espresso', 'Süt', 'Süt köpüğü'],
        allergens: ['Kafein', 'Süt ürünleri'],
        calories: 120,
        preparationTime: 5,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Latte',
        description: 'Yumuşak espresso, büyük miktarda buharda ısıtılmış süt ve hafif süt köpüğü.',
        price: 30.00,
        category: 'Kahve',
        available: true,
        stock: 90,
        image: '/images/menu/latte.jpg',
        ingredients: ['Espresso', 'Süt', 'Hafif süt köpüğü'],
        allergens: ['Kafein', 'Süt ürünleri'],
        calories: 150,
        preparationTime: 5,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Mocha',
        description: 'Espresso, çikolata sosu ve buharda ısıtılmış süt ile hazırlanan tatlı kahve.',
        price: 32.00,
        category: 'Kahve',
        available: true,
        stock: 75,
        image: '/images/menu/mocha.jpg',
        ingredients: ['Espresso', 'Çikolata sosu', 'Süt', 'Krema'],
        allergens: ['Kafein', 'Süt ürünleri', 'Çikolata'],
        calories: 200,
        preparationTime: 6,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Türk Kahvesi',
        description: 'Geleneksel yöntemle özel tencerede pişirilen otantik Türk kahvesi.',
        price: 22.00,
        category: 'Kahve',
        available: true,
        stock: 50,
        image: '/images/menu/turkish-coffee.jpg',
        ingredients: ['Kahve', 'Su', 'Şeker (opsiyonel)'],
        allergens: ['Kafein'],
        calories: 2,
        preparationTime: 8,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },

      // TATLI KATEGORİSİ
      {
        name: 'Tiramisu',
        description: 'İtalyan klasiği: mascarpone peyniri, ladyfinger bisküvi ve espresso ile.',
        price: 45.00,
        category: 'Tatlı',
        available: true,
        stock: 15,
        image: '/images/menu/tiramisu.jpg',
        ingredients: ['Mascarpone', 'Ladyfinger bisküvi', 'Espresso', 'Kakao'],
        allergens: ['Süt ürünleri', 'Yumurta', 'Gluten', 'Kafein'],
        calories: 350,
        preparationTime: 2,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Cheesecake',
        description: 'Kremalı New York usulü cheesecake, meyveli sos ile.',
        price: 42.00,
        category: 'Tatlı',
        available: true,
        stock: 12,
        image: '/images/menu/cheesecake.jpg',
        ingredients: ['Krem peynir', 'Bisküvi tabanı', 'Meyveli sos'],
        allergens: ['Süt ürünleri', 'Yumurta', 'Gluten'],
        calories: 320,
        preparationTime: 2,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },

      // ATIŞTIRMALIK KATEGORİSİ
      {
        name: 'Croissant',
        description: 'Tereyağlı, çıtır çıtır Fransız croissant\'ı.',
        price: 18.00,
        category: 'Atıştırmalık',
        available: true,
        stock: 25,
        image: '/images/menu/croissant.jpg',
        ingredients: ['Un', 'Tereyağı', 'Süt', 'Maya'],
        allergens: ['Gluten', 'Süt ürünleri'],
        calories: 230,
        preparationTime: 3,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Blueberry Muffin',
        description: 'Taze yaban mersini ile hazırlanmış yumuşacık muffin.',
        price: 20.00,
        category: 'Atıştırmalık',
        available: true,
        stock: 20,
        image: '/images/menu/muffin.jpg',
        ingredients: ['Un', 'Yaban mersini', 'Tereyağı', 'Şeker', 'Yumurta'],
        allergens: ['Gluten', 'Süt ürünleri', 'Yumurta'],
        calories: 280,
        preparationTime: 2,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Club Sandviç',
        description: 'Tavuk, marul, domates ve özel soslu üç katlı sandviç.',
        price: 35.00,
        category: 'Atıştırmalık',
        available: true,
        stock: 18,
        image: '/images/menu/club-sandwich.jpg',
        ingredients: ['Ekmek', 'Tavuk', 'Marul', 'Domates', 'Mayonez'],
        allergens: ['Gluten', 'Yumurta'],
        calories: 450,
        preparationTime: 7,
        isPopular: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },

      // İÇECEK KATEGORİSİ
      {
        name: 'Soğuk Çay',
        description: 'Serinletici buzlu çay, limon dilimleri ile.',
        price: 15.00,
        category: 'İçecek',
        available: false, // Stokta yok
        stock: 0,
        image: '/images/menu/iced-tea.jpg',
        ingredients: ['Çay', 'Limon', 'Buz', 'Şeker'],
        allergens: [],
        calories: 80,
        preparationTime: 3,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        name: 'Meyve Smoothie',
        description: 'Mevsim meyvelerinden hazırlanan taze smoothie.',
        price: 25.00,
        category: 'İçecek',
        available: false, // Stokta yok
        stock: 0,
        image: '/images/menu/smoothie.jpg',
        ingredients: ['Muz', 'Çilek', 'Yoğurt', 'Bal'],
        allergens: ['Süt ürünleri'],
        calories: 180,
        preparationTime: 4,
        isPopular: false,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      }
    ];

    console.log('Demo menü öğeleri oluşturuluyor...');
    
    for (const item of menuItems) {
      const newItem = new MenuItem(item);
      await newItem.save();
      console.log(`${item.name} oluşturuldu (${item.category})`);
    }

    console.log('\nTüm demo menü öğeleri başarıyla oluşturuldu!');
    console.log(`Toplam ${menuItems.length} ürün eklendi`);

    // İstatistikler
    const stats = await MenuItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          availableCount: { $sum: { $cond: ['$available', 1, 0] } }
        }
      }
    ]);

    console.log('\nKategori İstatistikleri:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} ürün (${stat.availableCount} aktif)`);
    });

    console.log('\nTest için: http://localhost:3000/employee');
    console.log('Menu test için: http://localhost:3000/menu');

  } catch (err) {
    console.error('Hata:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Bağlantı kapatıldı');
  }
}

createSampleMenuItems(); 