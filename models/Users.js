const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  password: {
    type: String,
  },

  status: {
    type: Number,
    default: 1, // 0 => draft, 1 => publish (active), 2 => deactivated, 3 => deleted
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
  },
});

module.exports = mongoose.model("users", UserSchema);
