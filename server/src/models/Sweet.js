import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based', 'Vegetable-Based'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
sweetSchema.index({ name: 1, category: 1, price: 1 });

sweetSchema.pre('save', function(next) {
  this.name = this.name.trim();
  next();
});

const Sweet = mongoose.model('Sweet', sweetSchema);

export default Sweet;
