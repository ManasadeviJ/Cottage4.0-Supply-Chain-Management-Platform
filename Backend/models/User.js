import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Buyer", "Farmer", "Cottager", "Admin"],
      default: "Buyer",
    },
    phone: String,
    gender: String,
    profilePhotoURL: String,
    dateOfBirth: Date,
    isActive: { type: Boolean, default: true },

    buyerInfo: {
      companyName: String,
      companyDescription: String,
      totalOrders: Number,
      totalReturns: Number,
    },

    farmerInfo: {
      farmName: String,
      farmDescription: String,
      totalListedProducts: Number,
      certifications: [String],
      landProofDocumentURL: String,
    },

    cottagerInfo: {
      businessName: String,
      productCategory: String,
      totalProducts: Number,
      businessProofDocumentURL: String,
    },

    businessDetails: {
      companyName: String,
      registrationNumber: String,
      gstNumber: String,
      documents: [
        {
          type: { type: String },
          url: String,
          verified: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
