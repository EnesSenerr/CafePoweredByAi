const mongoose = require('mongoose');

const PointTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'İşlem miktarı zorunludur'],
    },
    type: {
      type: String,
      enum: ['earn', 'redeem', 'refund', 'admin_adjustment', 'expire'],
      required: [true, 'İşlem tipi zorunludur'],
    },
    description: {
      type: String,
      trim: true,
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
    },
    orderId: {
      type: String,
      trim: true,
    },
    balanceAfter: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'completed',
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// İndeksler oluştur
PointTransactionSchema.index({ user: 1, createdAt: -1 });
PointTransactionSchema.index({ type: 1 });

module.exports = mongoose.model('PointTransaction', PointTransactionSchema); 