import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: String,
  attachmentId: mongoose.Schema.Types.ObjectId,
  verified: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  profilePhotoURL: String,
  phone: String,
  dob: Date,
  gender: String,
  bio: String,
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  paymentRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  documents: [documentSchema],
  farmerDetails: {
    aadhaar: String,
    landProofAttachmentId: mongoose.Schema.Types.ObjectId,
    certifications: [String],
  },
  cottagerDetails: {
    businessName: String,
    businessDocAttachmentId: mongoose.Schema.Types.ObjectId,
  },
  buyerDetails: {
    deliveryPreferences: String,
  },
  approved: { type: Boolean, default: false },
  settings: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

userProfileSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("UserProfile", userProfileSchema);
