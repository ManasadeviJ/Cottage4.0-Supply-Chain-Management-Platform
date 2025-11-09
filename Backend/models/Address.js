import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["home", "office", "farm", "warehouse"], default: "home" },
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  geo: {
    lat: Number,
    lng: Number,
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

addressSchema.index({ userId: 1, isDefault: 1 });

export default mongoose.model("Address", addressSchema);
