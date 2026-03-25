require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test
app.get('/', (req, res) => {
  res.send('Server OK 🚀');
});


app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});