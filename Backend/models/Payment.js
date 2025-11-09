import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["bank", "upi", "card", "wallet"], required: true },
  token: String,
  masked: String,
  meta: {
    bankName: String,
    ifsc: String,
    upiId: String,
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

paymentSchema.index({ userId: 1 });

export default mongoose.model("Payment", paymentSchema);
