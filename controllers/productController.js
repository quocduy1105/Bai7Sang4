const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await Product.create({
      name,
      price,
      description
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo product thành công và inventory đã được tạo tự động',
      data: product
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Tạo product thất bại',
      error: error.message
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lấy danh sách product thất bại',
      error: error.message
    });
  }
};