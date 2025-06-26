const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');
const User = require('../src/models/User');
const StockItem = require('../src/models/StockItem');
require('dotenv').config();

const menuItemsData = [
  // Kahveler
  { name: 'Klasik Espresso', description: 'Yoğun ve aromatik espresso shot', price: 65, category: 'Kahve', stock: 100, preparationTime: 3, calories: 10, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Granül Şeker'] },
  { name: 'Cappuccino', description: 'Espresso, sıcak süt ve süt köpüğü karışımı', price: 80, category: 'Kahve', stock: 100, preparationTime: 5, calories: 120, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt', 'Granül Şeker'] },
  { name: 'Latte', description: 'Espresso ve bol miktarda buharlanmış süt', price: 85, category: 'Kahve', stock: 100, preparationTime: 5, calories: 190, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt', 'Granül Şeker'] },
  { name: 'Vanilya Latte', description: "Latte'ye vanilya şurubu eklenerek hazırlanan aromalı kahve", price: 95, category: 'Kahve', stock: 100, preparationTime: 6, calories: 230, isPopular: false, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt', 'Vanilya Şurubu', 'Granül Şeker'] },
  { name: 'Karamel Macchiato', description: 'Vanilya şuruplu süt, espresso ve karamel sos', price: 110, category: 'Kahve', stock: 100, preparationTime: 7, calories: 280, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt', 'Vanilya Şurubu', 'Karamel Şurubu'] },
  { name: 'Mocha', description: 'Espresso, çikolata şurubu ve süt karışımı', price: 105, category: 'Kahve', stock: 100, preparationTime: 6, calories: 290, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt', 'Çikolata Şurubu', 'Krema'] },
  { name: 'Americano', description: 'Espresso ve sıcak su ile hazırlanan klasik kahve', price: 60, category: 'Kahve', stock: 100, preparationTime: 4, calories: 15, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Sıcak Su'] },
  { name: 'Flat White', description: 'Yoğun espresso ve ince süt köpüğü', price: 90, category: 'Kahve', stock: 80, preparationTime: 5, calories: 110, isPopular: false, requiredIngredients: ['Espresso Karışımı', 'Tam Yağlı Süt'] },
  { name: 'Filtre Kahve', description: 'Klasik filtre kahve', price: 70, category: 'Kahve', stock: 120, preparationTime: 4, calories: 8, isPopular: false, requiredIngredients: ['Filtre Kahve', 'Sıcak Su'] },
  { name: 'Soğuk Demleme', description: 'Soğuk demleme yöntemiyle hazırlanan ferahlatıcı kahve', price: 95, category: 'Kahve', stock: 60, preparationTime: 12, calories: 12, isPopular: false, requiredIngredients: ['Filtre Kahve', 'Soğuk Su', 'Buz'] },

  // Sıcak & Soğuk İçecekler
  { name: 'Sıcak Çikolata', description: 'Kremsi sıcak çikolata, üzerinde krema', price: 75, category: 'İçecek', stock: 80, preparationTime: 5, calories: 340, isPopular: true, requiredIngredients: ['Kakao Tozu', 'Tam Yağlı Süt', 'Çikolata Şurubu', 'Krema', 'Granül Şeker'] },
  { name: 'Matcha Latte', description: 'Japon matcha çayı ve süt', price: 90, category: 'İçecek', stock: 50, preparationTime: 6, calories: 120, isPopular: false, requiredIngredients: ['Matcha Tozu', 'Badem Sütü', 'Granül Şeker'] },
  { name: 'Buzlu Latte', description: 'Soğuk süt ve espresso ile hazırlanan latte', price: 95, category: 'İçecek', stock: 70, preparationTime: 5, calories: 180, isPopular: true, requiredIngredients: ['Espresso Karışımı', 'Soğuk Süt', 'Buz'] },
  { name: 'Limonata', description: 'Taze limon suyu ve nane ile hazırlanan serinletici içecek', price: 55, category: 'İçecek', stock: 90, preparationTime: 4, calories: 60, isPopular: true, requiredIngredients: ['Limon', 'Nane', 'Şeker', 'Su'] },
  { name: 'Berry Smoothie', description: 'Çilek, yaban mersini ve chia tohumu ile smoothie', price: 85, category: 'İçecek', stock: 50, preparationTime: 8, calories: 280, isPopular: true, requiredIngredients: ['Çilek', 'Yaban Mersini', 'Muz', 'Yulaf Sütü', 'Chia Tohumu', 'Bal'] },
  { name: 'Tropical Smoothie', description: 'Mango, ananas ve hindistan cevizi ile tropikal smoothie', price: 90, category: 'İçecek', stock: 50, preparationTime: 8, calories: 260, isPopular: false, requiredIngredients: ['Mango', 'Ananas', 'Hindistan Cevizi Yağı', 'Badem Sütü', 'Bal'] },
  { name: 'Detox Green Juice', description: 'Ispanak, elma, salatalık ve limon ile sağlıklı içecek', price: 70, category: 'İçecek', stock: 40, preparationTime: 6, calories: 45, isPopular: false, requiredIngredients: ['Ispanak', 'Elma', 'Salatalık', 'Limon'] },

  // Tatlılar
  { name: 'San Sebastian Cheesecake', description: 'Karamelize üstüyle ünlü İspanyol cheesecake', price: 80, category: 'Tatlı', stock: 30, preparationTime: 0, calories: 420, isPopular: true, requiredIngredients: ['Labne', 'Yumurta', 'Şeker', 'Krema', 'Un'] },
  { name: 'Çikolatalı Sufle', description: 'Akışkan çikolata dolgulu sıcak sufle', price: 70, category: 'Tatlı', stock: 25, preparationTime: 0, calories: 390, isPopular: true, requiredIngredients: ['Bitter Çikolata', 'Yumurta', 'Şeker', 'Un', 'Tereyağı'] },
  { name: 'Fıstıklı Baklava', description: 'Geleneksel fıstıklı baklava', price: 75, category: 'Tatlı', stock: 40, preparationTime: 0, calories: 350, isPopular: false, requiredIngredients: ['Fıstık', 'Yufka', 'Şeker', 'Tereyağı'] },
  { name: 'Vegan Brownie', description: 'Glutensiz, şekersiz, vegan brownie', price: 65, category: 'Tatlı', stock: 20, preparationTime: 0, calories: 210, isPopular: false, requiredIngredients: ['Badem Unu', 'Hurme', 'Kakao Tozu', 'Ceviz'] },
  { name: 'Frambuazlı Cheesecake', description: 'Taze frambuazlı, kremalı cheesecake', price: 85, category: 'Tatlı', stock: 30, preparationTime: 0, calories: 410, isPopular: true, requiredIngredients: ['Labne', 'Frambuaz', 'Şeker', 'Krema', 'Un'] },
  { name: 'Profiterol', description: 'Çikolata soslu profiterol topları', price: 70, category: 'Tatlı', stock: 35, preparationTime: 0, calories: 370, isPopular: false, requiredIngredients: ['Un', 'Yumurta', 'Krema', 'Çikolata'] },
  { name: 'Tiramisu', description: 'Kahveli, kremalı İtalyan tatlısı', price: 80, category: 'Tatlı', stock: 30, preparationTime: 0, calories: 340, isPopular: true, requiredIngredients: ['Labne', 'Krema', 'Kakao Tozu', 'Kedi Dili', 'Kahve'] },
  { name: 'Magnolia', description: 'Muzlu, bisküvili hafif tatlı', price: 60, category: 'Tatlı', stock: 30, preparationTime: 0, calories: 250, isPopular: false, requiredIngredients: ['Muz', 'Bisküvi', 'Krema', 'Süt'] },

  // Atıştırmalıklar
  { name: 'Avokadolu Tost', description: 'Çavdar ekmeği, avokado ve yumurta ile sağlıklı tost', price: 75, category: 'Atıştırmalık', stock: 20, preparationTime: 7, calories: 320, isPopular: true, requiredIngredients: ['Çavdar Ekmeği', 'Avokado', 'Yumurta', 'Zeytinyağı'] },
  { name: 'Sebzeli Kinoa Salata', description: 'Kinoa, taze sebzeler ve nar ekşisi ile hafif salata', price: 70, category: 'Atıştırmalık', stock: 15, preparationTime: 6, calories: 180, isPopular: false, requiredIngredients: ['Kinoa', 'Domates', 'Salatalık', 'Biber', 'Nar Ekşisi'] },
  { name: 'Peynirli Poğaça', description: 'Taze beyaz peynirli poğaça', price: 40, category: 'Atıştırmalık', stock: 40, preparationTime: 3, calories: 210, isPopular: false, requiredIngredients: ['Un', 'Beyaz Peynir', 'Süt', 'Yumurta'] },
  { name: 'Vegan Sandviç', description: 'Humus, avokado ve taze sebzelerle vegan sandviç', price: 65, category: 'Atıştırmalık', stock: 20, preparationTime: 5, calories: 230, isPopular: false, requiredIngredients: ['Tam Buğday Ekmeği', 'Humus', 'Avokado', 'Domates', 'Salatalık'] },
  { name: 'Hindi Fümeli Baget', description: 'Hindi füme, kaşar peyniri ve yeşilliklerle baget sandviç', price: 80, category: 'Atıştırmalık', stock: 25, preparationTime: 5, calories: 270, isPopular: true, requiredIngredients: ['Baget Ekmeği', 'Hindi Füme', 'Kaşar Peyniri', 'Marul'] },
  { name: 'Ton Balıklı Salata', description: 'Ton balığı, mısır ve yeşilliklerle protein dolu salata', price: 85, category: 'Atıştırmalık', stock: 18, preparationTime: 6, calories: 210, isPopular: false, requiredIngredients: ['Ton Balığı', 'Mısır', 'Marul', 'Zeytinyağı'] },
  { name: 'Kinoa Bowl', description: 'Kinoa, nohut, avokado ve yoğurtlu sos ile bowl', price: 90, category: 'Atıştırmalık', stock: 15, preparationTime: 7, calories: 260, isPopular: false, requiredIngredients: ['Kinoa', 'Nohut', 'Avokado', 'Yoğurt', 'Zeytinyağı'] },

  // Vegan & Glutensiz
  { name: 'Vegan Wrap', description: 'Izgara sebzeler ve humus ile vegan dürüm', price: 70, category: 'Diğer', stock: 15, preparationTime: 6, calories: 190, isPopular: false, requiredIngredients: ['Tortilla', 'Humus', 'Izgara Sebze'] },
  { name: 'Glutensiz Kurabiye', description: 'Badem unu ve hurma ile yapılan glutensiz kurabiye', price: 45, category: 'Diğer', stock: 20, preparationTime: 3, calories: 120, isPopular: false, requiredIngredients: ['Badem Unu', 'Hurme', 'Kakao Tozu'] },
  { name: 'Vegan Muffin', description: 'Çikolatalı, şekersiz vegan muffin', price: 50, category: 'Diğer', stock: 20, preparationTime: 4, calories: 150, isPopular: false, requiredIngredients: ['Tam Buğday Unu', 'Kakao Tozu', 'Hindistan Cevizi Yağı', 'Muz'] },
  { name: 'Falafel Bowl', description: 'Nohut köftesi, yeşillik ve tahin sos ile vegan bowl', price: 80, category: 'Diğer', stock: 15, preparationTime: 6, calories: 210, isPopular: false, requiredIngredients: ['Nohut', 'Maydanoz', 'Tahin', 'Marul'] },
  { name: 'Vegan Cheesecake', description: 'Süt ürünsüz, glutensiz vegan cheesecake', price: 85, category: 'Diğer', stock: 10, preparationTime: 0, calories: 220, isPopular: false, requiredIngredients: ['Vegan Labne', 'Badem Unu', 'Hindistan Cevizi Yağı', 'Hurme'] },

  // Diğer
  { name: 'Klasik Türk Çayı', description: 'Demlikte demlenmiş klasik siyah çay', price: 30, category: 'İçecek', stock: 200, preparationTime: 3, calories: 2, isPopular: true, requiredIngredients: ['Çay', 'Su'] },
  { name: 'Bitki Çayı', description: 'Nane-limon, adaçayı, papatya gibi çeşitli bitki çayları', price: 35, category: 'İçecek', stock: 100, preparationTime: 3, calories: 2, isPopular: false, requiredIngredients: ['Bitki Çayı', 'Su'] },
  { name: 'Sade Soda', description: 'Doğal maden suyu', price: 25, category: 'İçecek', stock: 100, preparationTime: 1, calories: 0, isPopular: false, requiredIngredients: ['Soda'] },
  { name: 'Portakal Suyu', description: 'Taze sıkılmış portakal suyu', price: 55, category: 'İçecek', stock: 60, preparationTime: 2, calories: 80, isPopular: true, requiredIngredients: ['Portakal'] },
  { name: 'Badem Sütlü Latte', description: 'Badem sütü ile hazırlanan latte', price: 95, category: 'Kahve', stock: 40, preparationTime: 5, calories: 120, isPopular: false, requiredIngredients: ['Espresso Karışımı', 'Badem Sütü', 'Granül Şeker'] },
  { name: 'Karamelli Brownie', description: 'Karamel soslu, yoğun çikolatalı brownie', price: 70, category: 'Tatlı', stock: 20, preparationTime: 0, calories: 320, isPopular: false, requiredIngredients: ['Bitter Çikolata', 'Karamel', 'Un', 'Yumurta'] },
  { name: 'Çilekli Parfe', description: 'Çilek ve kremalı hafif tatlı', price: 60, category: 'Tatlı', stock: 15, preparationTime: 0, calories: 180, isPopular: false, requiredIngredients: ['Çilek', 'Krema', 'Bisküvi'] },
  { name: 'Kahveli Dondurma', description: 'Kahve aromalı dondurma', price: 50, category: 'Tatlı', stock: 10, preparationTime: 0, calories: 160, isPopular: false, requiredIngredients: ['Süt', 'Krema', 'Kahve', 'Şeker'] },
  { name: 'Fıstık Ezmeli Kurabiye', description: 'Fıstık ezmesiyle yapılan nefis kurabiye', price: 55, category: 'Tatlı', stock: 18, preparationTime: 0, calories: 200, isPopular: false, requiredIngredients: ['Fıstık Ezmesi', 'Un', 'Şeker', 'Yumurta'] },
  { name: 'Klasik Simit', description: 'Taze, susamlı klasik simit', price: 20, category: 'Atıştırmalık', stock: 100, preparationTime: 2, calories: 180, isPopular: true, requiredIngredients: ['Un', 'Susam', 'Pekmez'] },
  { name: 'Peynirli Börek', description: 'Beyaz peynirli çıtır börek', price: 45, category: 'Atıştırmalık', stock: 30, preparationTime: 4, calories: 220, isPopular: false, requiredIngredients: ['Yufka', 'Beyaz Peynir', 'Yumurta', 'Süt'] },
  { name: 'Sebzeli Omlet', description: 'Taze sebzelerle hazırlanan omlet', price: 55, category: 'Atıştırmalık', stock: 20, preparationTime: 6, calories: 160, isPopular: false, requiredIngredients: ['Yumurta', 'Biber', 'Domates', 'Peynir'] },
  { name: 'Kahvaltı Tabağı', description: 'Peynir, zeytin, domates, salatalık, yumurta ve reçel', price: 120, category: 'Atıştırmalık', stock: 15, preparationTime: 10, calories: 350, isPopular: true, requiredIngredients: ['Peynir', 'Zeytin', 'Domates', 'Salatalık', 'Yumurta', 'Reçel'] },
];

function normalizeName(name) {
  return name ? name.trim().toLocaleLowerCase('tr-TR') : '';
}

async function ensureAllIngredientsInStockFromMenuData(menuItemsData) {
  // Menüdeki ürünlerin ingredient isimlerini topla (scriptteki tanımdan)
  const allIngredients = new Set();
  menuItemsData.forEach(item => {
    if (item.ingredients && Array.isArray(item.ingredients)) {
      item.ingredients.forEach(ing => allIngredients.add(normalizeName(ing)));
    }
    if (item.requiredIngredients && Array.isArray(item.requiredIngredients)) {
      item.requiredIngredients.forEach(ri => {
        if (typeof ri === 'string') allIngredients.add(normalizeName(ri));
        if (ri.name) allIngredients.add(normalizeName(ri.name));
        if (ri.stockItemName) allIngredients.add(normalizeName(ri.stockItemName));
      });
    }
  });
  const stockItems = await StockItem.find({});
  const stockNames = new Set(stockItems.map(s => normalizeName(s.name)));
  for (const ing of allIngredients) {
    if (ing && !stockNames.has(ing)) {
      await StockItem.create({
        name: ing,
        category: 'Diğer',
        currentStock: 1000,
        minStock: 10,
        unit: 'gram',
        price: 1,
        supplier: 'Otomatik',
        description: 'Otomatik eklenen ingredient'
      });
      console.log(`[Otomatik Stok] '${ing}' stoğa eklendi!`);
    }
  }
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await MenuItem.deleteMany({});
  const adminUser = await User.findOne({ role: 'admin' });
  const stockItems = await StockItem.find({});
  const stockMap = {};
  stockItems.forEach(item => { stockMap[item.name] = { id: item._id, unit: item.unit }; });

  if (!adminUser) {
    console.warn('Admin kullanıcı bulunamadı, menü item kaydı atlanıyor.');
    return;
  }

  await ensureAllIngredientsInStockFromMenuData(menuItemsData);

  for (const item of menuItemsData) {
    const category = item.category === 'Vegan' ? 'Diğer' : item.category;
    const validIngredients = item.requiredIngredients
      .map(name => stockMap[name] ? {
        stockItem: stockMap[name].id,
        quantity: 1,
        unit: stockMap[name].unit
      } : null)
      .filter(Boolean);
    if (validIngredients.length < item.requiredIngredients.length) {
      const missing = item.requiredIngredients.filter(name => !stockMap[name]);
      console.log(`Uyarı: '${item.name}' için stokta bulunmayan ingredient(lar):`, missing);
    }
    await new MenuItem({
      ...item,
      category,
      preparationTime: item.preparationTime && item.preparationTime > 0 ? item.preparationTime : 1,
      requiredIngredients: validIngredients,
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
  }
  await mongoose.disconnect();
  console.log('Detaylı menü ürünleri eklendi!');
}

run(); 