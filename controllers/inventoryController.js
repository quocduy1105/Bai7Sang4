const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

/**
 * GET ALL inventory có join product
 */
exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find()
      .populate('product')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inventories.length,
      data: inventories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lấy danh sách inventory thất bại',
      error: error.message
    });
  }
};

/**
 * GET inventory by ID có join product
 */
exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inventory không hợp lệ'
      });
    }

    const inventory = await Inventory.findById(id).populate('product');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory'
      });
    }

    return res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lấy inventory theo ID thất bại',
      error: error.message
    });
  }
};

/**
 * POST add-stock
 * body: { product, quantity }
 * tăng stock
 */
exports.addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'product và quantity là bắt buộc'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: 'product ID không hợp lệ'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity phải lớn hơn 0'
      });
    }

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy product'
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true }
    ).populate('product');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory của product này'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tăng stock thành công',
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Add stock thất bại',
      error: error.message
    });
  }
};

/**
 * POST remove-stock
 * body: { product, quantity }
 * giảm stock
 */
exports.removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'product và quantity là bắt buộc'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: 'product ID không hợp lệ'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity phải lớn hơn 0'
      });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory'
      });
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock không đủ để giảm'
      });
    }

    inventory.stock -= quantity;
    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      success: true,
      message: 'Giảm stock thành công',
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Remove stock thất bại',
      error: error.message
    });
  }
};

/**
 * POST reservation
 * body: { product, quantity }
 * giảm stock và tăng reserved
 */
exports.reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'product và quantity là bắt buộc'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: 'product ID không hợp lệ'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity phải lớn hơn 0'
      });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory'
      });
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock không đủ để reservation'
      });
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;

    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      success: true,
      message: 'Reservation thành công',
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Reservation thất bại',
      error: error.message
    });
  }
};

/**
 * POST sold
 * body: { product, quantity }
 * giảm reserved và tăng soldCount
 */
exports.sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'product và quantity là bắt buộc'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: 'product ID không hợp lệ'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity phải lớn hơn 0'
      });
    }

    const inventory = await Inventory.findOne({ product });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory'
      });
    }

    if (inventory.reserved < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Reserved không đủ để chuyển sang sold'
      });
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;

    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      success: true,
      message: 'Cập nhật sold thành công',
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Sold thất bại',
      error: error.message
    });
  }
};