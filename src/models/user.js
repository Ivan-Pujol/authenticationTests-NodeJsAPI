const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: string,
    required: true
  },
  email: {
    type: string,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: string,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;