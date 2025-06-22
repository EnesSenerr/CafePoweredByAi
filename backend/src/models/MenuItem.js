const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true,
    maxlength: [100, 'Ürün adı 100 karakterden uzun olamaz']
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması zorunludur'],
    trim: true,
    maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur'],
    min: [0, 'Fiyat negatif olamaz']
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['Kahve', 'Tatlı', 'Atıştırmalık', 'İçecek', 'Diğer'],
    default: 'Diğer'
  },
  available: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'Stok miktarı zorunludur'],
    min: [0, 'Stok negatif olamaz'],
    default: 0
  },
  image: {
    type: String,
    default: null // Ürün resmi URL'i (opsiyonel)
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  calories: {
    type: Number,
    min: [0, 'Kalori negatif olamaz'],
    default: null
  },
  preparationTime: {
    type: Number, // dakika cinsinden
    min: [1, 'Hazırlık süresi en az 1 dakika olmalı'],
    default: 5
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // createdAt ve updatedAt otomatik eklenir
});

// Index'ler
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ available: 1 });
menuItemSchema.index({ isPopular: 1 });
menuItemSchema.index({ name: 'text', description: 'text' }); // Arama için

// Virtual field - stok durumu
menuItemSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// JSON serialize edilirken virtual field'ları dahil et
menuItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('MenuItem', menuItemSchema); 