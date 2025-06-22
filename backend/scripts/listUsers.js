const mongoose = require('mongoose');
require('dotenv').config();

// User model'i import et
const User = require('../src/models/User');

// MongoDB bağlantı string'i
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aicafe';

async function listUsers() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    console.log('\nVeritabanındaki kullanıcılar:\n');
    
    const users = await User.find({}).select('-password').sort({ role: 1, createdAt: -1 });
    
    if (users.length === 0) {
      console.log('Hiç kullanıcı bulunamadı!');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.role.toUpperCase()}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   İsim: ${user.name}`);
        console.log(`   Telefon: ${user.phone || 'Belirtilmemiş'}`);
        console.log(`   Puan: ${user.points}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Oluşturulma: ${user.createdAt?.toLocaleString('tr-TR') || 'Belirtilmemiş'}`);
        console.log(`   Son giriş: ${user.lastLogin?.toLocaleString('tr-TR') || 'Hiç giriş yapmamış'}`);
        console.log(`   Aktif: ${user.isActive ? 'Evet' : 'Hayır'}`);
        console.log('');
      });
      
      console.log(`Toplam ${users.length} kullanıcı bulundu`);
      
      // Role bazında sayım
      const roleCount = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\nRole göre dağılım:');
      Object.entries(roleCount).forEach(([role, count]) => {
        console.log(`   ${role}: ${count} kullanıcı`);
      });
    }
    
  } catch (error) {
    console.error('Kullanıcılar listelenirken hata:', error);
  } finally {
    console.log('\nMongoDB bağlantısı kapatılıyor...');
    await mongoose.connection.close();
    console.log('Bağlantı kapatıldı');
    process.exit(0);
  }
}

// Script'i çalıştır
listUsers(); 