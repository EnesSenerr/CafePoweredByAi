const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
  return '5' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

const names = [
  'Ayşe Yılmaz', 'Mehmet Demir', 'Zeynep Kaya', 'Ali Çelik', 'Fatma Şahin', 'Emre Yıldız', 'Elif Aydın',
  'Ahmet Koç', 'Merve Arslan', 'Burak Güneş', 'Seda Polat', 'Canan Aksoy', 'Hakan Öz', 'Gülşah Kılıç',
  'Onur Eren', 'Derya Kurt', 'Serkan Uçar', 'Büşra Avcı', 'Cemre Taş', 'Barış Akın', 'Ece Güler',
  'Yusuf Korkmaz', 'Melis Yavuz', 'Deniz Karaca', 'Sibel Yıldırım', 'Okan Duran', 'Gizem Yıldız',
  'Furkan Şimşek', 'Berkay Kılıç', 'Tuğçe Yılmaz', 'İrem Demir', 'Kadir Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
  'Kerem Şimşek', 'Büşra Kılıç', 'Berkay Yılmaz', 'Tuğba Demir', 'İlker Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
  'Kerem Şimşek', 'Büşra Kılıç', 'Berkay Yılmaz', 'Tuğba Demir', 'İlker Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
  'Kerem Şimşek', 'Büşra Kılıç', 'Berkay Yılmaz', 'Tuğba Demir', 'İlker Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
  'Kerem Şimşek', 'Büşra Kılıç', 'Berkay Yılmaz', 'Tuğba Demir', 'İlker Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
  'Kerem Şimşek', 'Büşra Kılıç', 'Berkay Yılmaz', 'Tuğba Demir', 'İlker Yıldız', 'Pelin Aksoy',
  'Murat Güneş', 'Sena Polat', 'Cansu Arslan', 'Gökhan Koç', 'Beyza Şahin', 'Uğur Aydın', 'Sinem Öz',
  'Eren Yıldız', 'Büşra Çelik', 'Mert Şahin', 'Dilan Yavuz', 'Süleyman Demir', 'Esra Güler',
  'Yasemin Korkmaz', 'Tolga Yavuz', 'Hande Karaca', 'Bora Yıldırım', 'Selin Duran', 'Gökçe Yıldız',
];

const roles = ['customer', 'employee', 'admin'];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});

  // Adminler
  for (let i = 0; i < 3; i++) {
    await new User({
      name: `Admin ${i+1}`,
      email: `admin${i+1}@aicafe.com`,
      password: '123456',
      role: 'admin',
      phone: randomPhone(),
      points: Math.floor(Math.random() * 100),
      isActive: true,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      signupMethod: 'email'
    }).save();
  }

  // Çalışanlar
  for (let i = 0; i < 12; i++) {
    await new User({
      name: `Çalışan ${names[i]}`,
      email: `employee${i+1}@aicafe.com`,
      password: '123456',
      role: 'employee',
      phone: randomPhone(),
      points: Math.floor(Math.random() * 50),
      isActive: Math.random() > 0.1,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      signupMethod: 'email'
    }).save();
  }

  // Müşteriler
  for (let i = 0; i < 120; i++) {
    await new User({
      name: names[i+12] || `Müşteri ${i+1}`,
      email: `customer${i+1}@aicafe.com`,
      password: '123456',
      role: 'customer',
      phone: randomPhone(),
      points: Math.floor(Math.random() * 500),
      isActive: Math.random() > 0.05,
      createdAt: randomDate(new Date(2022, 0, 1), new Date()),
      signupMethod: Math.random() > 0.7 ? 'mobile' : 'email'
    }).save();
  }

  await mongoose.disconnect();
  console.log('Detaylı kullanıcı verileri eklendi!');
}

run(); 