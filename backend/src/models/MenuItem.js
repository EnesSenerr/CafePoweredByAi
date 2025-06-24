const mongoose = require('mongoose');

// Birim çevirimi için helper fonksiyon
function convertToBaseUnit(value, unit) {
  switch (unit) {
    case 'kg':
      return value * 1000; // gram'a çevir
    case 'litre':
      return value * 1000; // ml'ye çevir
    case 'paket':
    case 'kutu':
    case 'adet':
    case 'gram':
    case 'ml':
      return value; // Zaten base unit
    default:
      return value;
  }
}

// İki birimi karşılaştırmak için normalize et
function normalizeUnits(requiredAmount, requiredUnit, availableAmount, availableUnit) {
  // Aynı birim grubuna mı ait kontrol et
  const weightUnits = ['gram', 'kg'];
  const volumeUnits = ['ml', 'litre'];
  const countUnits = ['adet', 'paket', 'kutu'];
  
  // Eğer aynı birim grubundaysa çevir
  if (weightUnits.includes(requiredUnit) && weightUnits.includes(availableUnit)) {
    return {
      required: convertToBaseUnit(requiredAmount, requiredUnit),
      available: convertToBaseUnit(availableAmount, availableUnit),
      unit: 'gram'
    };
  }
  
  if (volumeUnits.includes(requiredUnit) && volumeUnits.includes(availableUnit)) {
    return {
      required: convertToBaseUnit(requiredAmount, requiredUnit),
      available: convertToBaseUnit(availableAmount, availableUnit),
      unit: 'ml'
    };
  }
  
  if (countUnits.includes(requiredUnit) && countUnits.includes(availableUnit)) {
    return {
      required: requiredAmount,
      available: availableAmount,
      unit: requiredUnit
    };
  }
  
  // Farklı birim grubundaysa çeviremez, olduğu gibi dön
  return {
    required: requiredAmount,
    available: availableAmount,
    unit: requiredUnit
  };
}

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
  // Malzeme listesi - stok referansları ile
  requiredIngredients: [{
    stockItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StockItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.1, 'Miktar en az 0.1 olmalı']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'gram', 'litre', 'ml', 'adet', 'paket', 'kutu'],
      default: 'gram'
    }
  }],
  // Eski metin tabanlı malzeme listesi - geriye uyumluluk için
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

// Virtual field - malzeme uygunluk durumu (birim çevirimi ile)
menuItemSchema.virtual('ingredientAvailability').get(function() {
  if (!this.requiredIngredients || this.requiredIngredients.length === 0) {
    return 'available';
  }
  
  // Bu hesaplama populate edilmiş veriler için çalışır
  const unavailableIngredients = this.requiredIngredients.filter(ingredient => {
    if (!ingredient.stockItem) return true;
    
    // Birim çevirimi yap
    const normalized = normalizeUnits(
      ingredient.quantity,
      ingredient.unit,
      ingredient.stockItem.currentStock,
      ingredient.stockItem.unit
    );
    
    return normalized.available < normalized.required;
  });
  
  if (unavailableIngredients.length === 0) return 'available';
  if (unavailableIngredients.length === this.requiredIngredients.length) return 'unavailable';
  return 'partially_available';
});

// JSON serialize edilirken virtual field'ları dahil et
menuItemSchema.set('toJSON', { virtuals: true });

// Export helper functions
menuItemSchema.statics.normalizeUnits = normalizeUnits;
menuItemSchema.statics.convertToBaseUnit = convertToBaseUnit;

module.exports = mongoose.model('MenuItem', menuItemSchema); 