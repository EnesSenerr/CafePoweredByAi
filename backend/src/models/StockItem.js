const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Kahve Çekirdekleri', 
      'Süt Ürünleri', 
      'Şeker ve Tatlandırıcılar', 
      'Meyveler',
      'Sebzeler', 
      'Baharat ve Çeşniler',
      'Protein Tozları',
      'Şuruplar', 
      'Kuru Meyveler',
      'Fındık ve Tohum',
      'Kağıt ve Ambalaj',
      'Temizlik',
      'Diğer'
    ],
    default: 'Diğer'
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'litre', 'ml', 'adet', 'paket', 'kutu'],
    default: 'adet'
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Stok seviyesi kontrolü için virtual
stockItemSchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) {
    return 'Tükendi';
  } else if (this.currentStock <= this.minStock) {
    return 'Kritik Seviye';
  } else if (this.currentStock <= this.minStock * 1.5) {
    return 'Düşük Seviye';
  } else {
    return 'Normal';
  }
});

// Stok seviyesi renk kodu için virtual
stockItemSchema.virtual('stockColor').get(function() {
  const status = this.stockStatus;
  switch (status) {
    case 'Tükendi': return 'red';
    case 'Kritik Seviye': return 'red';
    case 'Düşük Seviye': return 'yellow';
    case 'Normal': return 'green';
    default: return 'gray';
  }
});

// Index'ler
stockItemSchema.index({ name: 1 });
stockItemSchema.index({ category: 1 });
stockItemSchema.index({ currentStock: 1 });

module.exports = mongoose.model('StockItem', stockItemSchema); 