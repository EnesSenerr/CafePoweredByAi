const mongoose = require('mongoose');
require('dotenv').config();

// User model'i import et
const User = require('../src/models/User');

// MongoDB bağlantı string'i
const MONGODB_URI = process.env.MONGODB_URI;

async function updateOldUsers() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    console.log('\nEski kullanıcılar kontrol ediliyor...');
    
    // role alanı olmayan kullanıcıları bul
    const oldUsers = await User.find({ role: { $exists: false } });
    
    if (oldUsers.length === 0) {
      console.log('Güncellenmesi gereken kullanıcı bulunamadı');
    } else {
      console.log(`${oldUsers.length} kullanıcının rolü güncellenecek:`);
      
      // Her kullanıcıyı listele
      oldUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
      });
      
      // Tüm role alanı olmayan kullanıcıları 'customer' olarak güncelle
      const updateResult = await User.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'customer' } }
      );
      
      console.log(`${updateResult.modifiedCount} kullanıcının rolü 'customer' olarak güncellendi`);
    }
    
    // Güncel kullanıcı sayılarını göster
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nGüncel kullanıcı istatistikleri:');
    userCounts.forEach(({ _id, count }) => {
      console.log(`- ${_id || 'undefined'}: ${count} kullanıcı`);
    });
    
  } catch (error) {
    console.error('Rol güncelleme hatası:', error);
  } finally {
    console.log('\nMongoDB bağlantısı kapatılıyor...');
    await mongoose.connection.close();
    console.log('Bağlantı kapatıldı');
    process.exit(0);
  }
}

// Script'i çalıştır
updateOldUsers(); 