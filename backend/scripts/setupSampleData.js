const mongoose = require('mongoose');
const { createSampleStockItems } = require('./createSampleStockItems');
const { createSampleMenuItems } = require('./createSampleMenuItems');
const { createTestUsers } = require('./createTestUsers');
const User = require('../src/models/User');
require('dotenv').config();

async function setupSampleData() {
  try {
    console.log('🚀 Sample veriler kuruluma başlanıyor...\n');

    // MongoDB bağlantısını kur
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı kuruldu\n');

    // 1. Önce kullanıcıları oluştur
    console.log('👤 Test kullanıcıları oluşturuluyor...');
    
    // createTestUsers içindeki kod parçasını burada çalıştır
    const testUsers = [
      {
        name: 'Demo Müşteri',
        email: 'customer@aicafe.com',
        password: '123456',
        role: 'customer',
        phone: '555-0001',
        points: 150,
        signupMethod: 'email'
      },
      {
        name: 'Demo Çalışan',
        email: 'employee@aicafe.com', 
        password: '123456',
        role: 'employee',
        phone: '555-0002',
        points: 50,
        signupMethod: 'email'
      },
      {
        name: 'Demo Admin',
        email: 'admin@aicafe.com',
        password: '123456',
        role: 'admin', 
        phone: '555-0003',
        points: 0,
        signupMethod: 'email'
      }
    ];

    // Mevcut kullanıcıları temizle
    await User.deleteMany({});
    console.log('Mevcut test kullanıcıları temizlendi');
    
    // Yeni kullanıcıları oluştur
    for (const userData of testUsers) {
      const user = new User({
        ...userData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await user.save();
      console.log(`${userData.role.toUpperCase()} kullanıcısı oluşturuldu: ${userData.email}`);
    }
    
    console.log('✅ Test kullanıcıları oluşturuldu\n');

    // 2. Stok öğelerini oluştur
    console.log('📦 Stok öğeleri oluşturuluyor...');
    await createSampleStockItems();
    console.log('✅ Stok öğeleri oluşturuldu\n');

    // 3. Menü öğelerini oluştur (stok referansları ile)
    console.log('🍰 Menü öğeleri oluşturuluyor...');
    await createSampleMenuItems();
    console.log('✅ Menü öğeleri oluşturuldu\n');

    console.log('🎉 Tüm sample veriler başarıyla kuruldu!');
    console.log('\n📊 Kurulum Özeti:');
    console.log('- Test kullanıcıları: admin, employee, customer');
    console.log('- Stok malzemeleri: Kahve çekirdekleri, süt ürünleri, meyveler, sebzeler vb.');
    console.log('- Menü öğeleri: Kahveler, smoothie\'ler ve atıştırmalıklar');
    console.log('- Malzeme bağlantıları: Menü öğeleri ile stok malzemeleri arasında');

    console.log('\n🔗 Test Linkleri:');
    console.log('- Backend API: http://localhost:5000/api');
    console.log('- Web Admin: http://localhost:3000/admin');
    console.log('- Web Employee: http://localhost:3000/employee');

    console.log('\n👤 Test Kullanıcıları:');
    console.log('- Admin: admin@aicafe.com / 123456');
    console.log('- Employee: employee@aicafe.com / 123456');
    console.log('- Customer: customer@aicafe.com / 123456');

  } catch (error) {
    console.error('❌ Sample veri kurulumu sırasında hata:', error);
    process.exit(1);
  } finally {
    // MongoDB bağlantısını kapat
    await mongoose.disconnect();
    console.log('\n✅ MongoDB bağlantısı kapatıldı');
  }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
  setupSampleData();
}

module.exports = setupSampleData; 