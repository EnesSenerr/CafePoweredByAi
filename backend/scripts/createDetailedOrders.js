const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const MenuItem = require('../src/models/MenuItem');
const User = require('../src/models/User');
require('dotenv').config();

const statuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
const notes = [
  '',
  'Şekersiz olsun',
  'Ekstra sıcak',
  'Buzsuz',
  'Soya sütü ile',
  'Yanında peçete',
  'Çift shot espresso',
  'Glutensiz ekmek',
  'Az tuzlu',
  'Vegan seçenek',
  'Lütfen hızlı olsun',
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Order.deleteMany({});

  const customers = await User.find({ role: 'customer' });
  const employees = await User.find({ role: 'employee' });
  const menuItems = await MenuItem.find({});

  for (let i = 0; i < 220; i++) {
    const customer = customers[randomInt(0, customers.length - 1)];
    const employee = employees[randomInt(0, employees.length - 1)];
    const status = statuses[randomInt(0, statuses.length - 1)];
    const itemCount = randomInt(1, 4);
    const items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const menuItem = menuItems[randomInt(0, menuItems.length - 1)];
      const quantity = randomInt(1, 3);
      items.push({ menuItem: menuItem._id, quantity, price: menuItem.price });
      total += menuItem.price * quantity;
    }
    const order = new Order({
      orderNumber: `ORD${Date.now()}${i}`,
      items,
      customerName: customer.name,
      customerPhone: customer.phone,
      tableNumber: Math.random() > 0.7 ? randomInt(1, 20) : undefined,
      notes: notes[randomInt(0, notes.length - 1)],
      total,
      status,
      createdBy: customer._id,
      updatedBy: employee._id,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: new Date(),
    });
    await order.save();
  }
  await mongoose.disconnect();
  console.log('Detaylı sipariş verileri eklendi!');
}

run(); 