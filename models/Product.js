const mongoose = require('mongoose');
const Inventory = require('./Inventory');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá không được nhỏ hơn 0']
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

/**
 * Mỗi khi tạo product thì tự tạo inventory tương ứng
 */
productSchema.post('save', async function (doc, next) {
  try {
    const existingInventory = await Inventory.findOne({ product: doc._id });

    if (!existingInventory) {
      await Inventory.create({
        product: doc._id,
        stock: 0,
        reserved: 0,
        soldCount: 0
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', productSchema);