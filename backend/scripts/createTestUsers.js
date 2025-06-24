const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User model'i import et
const User = require('../src/models/User');

// Test kullanıcıları
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

async function createTestUsers() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    console.log('\nMevcut test kullanıcıları temizleniyor...');
    // Önce mevcut tüm kullanıcıları sil (sadece test amaçlı)
    await User.deleteMany({});
    console.log('Mevcut test kullanıcıları temizlendi');

    console.log('\nTest kullanıcıları oluşturuluyor...');
    
    for (const userData of testUsers) {
      try {
        // Kullanıcıyı oluştur - Model otomatik olarak şifreyi hashleyecek
        const user = new User({
          ...userData,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await user.save();
        
        console.log(`${userData.role.toUpperCase()} kullanıcısı oluşturuldu:`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Points: ${userData.points}`);
        console.log('');
        
      } catch (userError) {
        console.error(`${userData.email} oluşturulurken hata:`, userError.message);
      }
    }
    
    console.log('Tüm test kullanıcıları başarıyla oluşturuldu!');
    console.log('\nTest Senaryoları:');
    console.log('1. Customer: customer@aicafe.com / 123456');
    console.log('2. Employee: employee@aicafe.com / 123456'); 
    console.log('3. Admin: admin@aicafe.com / 123456');
    console.log('\nTest için: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('Test kullanıcıları oluşturulurken hata:', error);
  } finally {
    if (require.main === module) {
      console.log('\nMongoDB bağlantısı kapatılıyor...');
      await mongoose.disconnect();
      console.log('Bağlantı kapatıldı');
      process.exit(0);
    }
  }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
  createTestUsers();
}

module.exports = { createTestUsers, testUsers }; 