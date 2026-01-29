import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/DatabaseConnection.js';
import affiliateRoutes from './routes/affiliateRoutes.js';
import dealerRoutes from './routes/dealerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import offerRoutes from './routes/offerRoutes.js';




const app = express();
dotenv.config();

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello ES6 Backend!');
});

// Routes http://localhost:5000/api/affiliates
app.use('/api/affiliates', affiliateRoutes);

// Routes http://localhost:5000/api/dealers
app.use('/api/dealers', dealerRoutes);

// Routes http://localhost:5000/api/products
app.use('/api/products', productRoutes);

// Routes http://localhost:5000/api/orders
app.use('/api/orders', orderRoutes);

// Routes http://localhost:5000/api/payouts
app.use('/api/payouts', payoutRoutes);

// Routes http://localhost:5000/api/offers
app.use('/api/offers', offerRoutes);

connectDB();
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


