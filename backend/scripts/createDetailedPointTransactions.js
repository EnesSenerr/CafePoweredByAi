const mongoose = require('mongoose');
const PointTransaction = require('../src/models/PointTransaction');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const Reward = require('../src/models/Reward');
require('dotenv').config();

const types = ['earn', 'redeem', 'redeem'];
const descriptions = [
  'Siparişten puan kazandı',
  'Ödül kullandı',
  'Kampanya puanı',
  'Sadakat bonusu',
  'Puan harcandı',
  'Mobil uygulama kaydı',
  'Referans ile puan',
  'Yorum yaptı, puan aldı',
  'Doğum günü puanı',
  'İlk sipariş bonusu',
  'Puanla kahve aldı',
  'Puanla indirim kullandı',
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await PointTransaction.deleteMany({});

  const users = await User.find({ role: 'customer' });
  const orders = await Order.find({});
  const rewards = await Reward.find({});

  for (let i = 0; i < 520; i++) {
    const user = users[randomInt(0, users.length - 1)];
    const type = types[randomInt(0, types.length - 1)];
    let amount = 0;
    let order = null;
    let reward = null;
    let desc = descriptions[randomInt(0, descriptions.length - 1)];
    if (type === 'earn') {
      amount = randomInt(5, 50);
      if (Math.random() > 0.5) {
        order = orders[randomInt(0, orders.length - 1)];
        desc = 'Siparişten puan kazandı';
      }
    } else if (type === 'redeem') {
      amount = -randomInt(10, 200);
      if (Math.random() > 0.5) {
        order = orders[randomInt(0, orders.length - 1)];
        desc = 'Sipariş için puan harcandı veya ödül kullanıldı';
      } else if (rewards.length > 0) {
        reward = rewards[randomInt(0, rewards.length - 1)];
        desc = 'Ödül kullanımı';
      }
    }
    const pt = new PointTransaction({
      user: user._id,
      type,
      amount,
      description: desc,
      order: order ? order._id : undefined,
      reward: reward ? reward._id : undefined,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
    await pt.save();
  }
  await mongoose.disconnect();
  console.log('Detaylı puan işlemleri eklendi!');
}

run(); 