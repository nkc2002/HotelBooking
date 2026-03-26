const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const User = require('./models/User');

// Load env vars
dotenv.config();

const DEFAULT_ADMIN = {
  name: 'Default Admin',
  email: 'admin@hotelbooking.com',
  password: '123456',
  phone: '0900000000',
  role: 'admin',
};

const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (existingAdmin) {
    return;
  }

  await User.create(DEFAULT_ADMIN);
  console.log(`Default admin created: ${DEFAULT_ADMIN.email}`);
};

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hotel Booking API',
    version: '1.0.0',
  });
});

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await ensureDefaultAdmin();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`Startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;

