const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ödül adı zorunludur'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pointCost: {
      type: Number,
      required: [true, 'Ödül puan maliyeti zorunludur'],
      min: [1, 'Puan maliyeti en az 1 olmalıdır'],
    },
    category: {
      type: String,
      enum: ['içecek', 'yiyecek', 'indirim', 'özel', 'diğer'],
      default: 'diğer',
    },
    image: {
      type: String, // URL veya yol olarak saklanabilir
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: -1, // -1 sınırsız anlamına gelir
    },
    expiryDate: {
      type: Date,
    },
    redemptionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reward', RewardSchema); 