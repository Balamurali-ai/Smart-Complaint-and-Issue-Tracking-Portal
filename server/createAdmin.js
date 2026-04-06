/**
 * Run this script ONCE to create an admin account in MongoDB.
 * Usage: node createAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const existing = await User.findOne({ email: 'admin@college.com' });
    if (existing) {
      // Delete and recreate to fix any double-hashing from previous run
      await User.deleteOne({ email: 'admin@college.com' });
      console.log('Existing admin removed. Recreating...');
    }

    // Do NOT manually hash — the User model pre('save') hook handles hashing
    const admin = new User({
      name: 'College Admin',
      email: 'admin@college.com',
      password: 'Admin@123',
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('   Email   : admin@college.com');
    console.log('   Password: Admin@123');
    console.log('   Role    : admin');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
