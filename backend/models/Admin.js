const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    userId: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true, 
},

    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },

    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  this.userId = this.userId.toLowerCase();
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

adminSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`Password match for user ${this.userId}:`, isMatch);
  return isMatch;
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;