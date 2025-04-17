import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Customer from '../models/Customer';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternalwindfall';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create a test user
const createTestUser = async (): Promise<void> => {
  try {
    // Check if test user already exists
    const existingUser = await Customer.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }
    
    // Create test user
    const testUser = await Customer.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '929-754-8779',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      role: 'customer'
    });
    
    console.log('Test user created successfully:');
    console.log({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      customerId: testUser.customerId
    });
    
    return;
  } catch (error: any) {
    console.error(`Error creating test user: ${error.message}`);
    process.exit(1);
  }
};

// Run the script
(async () => {
  await connectDB();
  await createTestUser();
  process.exit(0);
})(); 