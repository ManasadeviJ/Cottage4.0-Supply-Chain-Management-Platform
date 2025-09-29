import { useState } from "react";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./RegistrationPage.css";

import { Link } from "react-router-dom";

function RegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const [panCard, setPanCard] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [landDoc, setLandDoc] = useState(null);
  const [bankDetails, setBankDetails] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDoc, setBusinessDoc] = useState(null);
  const [productDesc, setProductDesc] = useState("");
  const [preferences, setPreferences] = useState("");
  const [address, setAddress] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const errorMessageMap = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email.",
    "auth/weak-password": "Password should be at least 6 characters.",
  };

  const validateInputs = () => {
    if (!role) {
      setError("Please select a role");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    if (!consent) {
      setError("You must consent to the marketplace policy.");
      return false;
    }
    if (role === "Farmer") {
      if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return false;
      }
      if (
        !panCard ||
        !addressProof ||
        !landDoc ||
        !bankDetails ||
        !profilePhoto ||
        !productDesc
      ) {
        setError(
          "All Farmer documents, bank details, profile photo, and product description are required."
        );
        return false;
      }
    }
    if (role === "Cottager") {
      if (
        !businessName ||
        !businessDoc ||
        !panCard ||
        !addressProof ||
        !bankDetails ||
        !profilePhoto ||
        !productDesc
      ) {
        setError(
          "All Cottager documents, bank details, profile photo, and product description are required."
        );
        return false;
      }
    }
    if (role === "Buyer") {
      if (!address) {
        setError("Delivery address is required for Buyers.");
        return false;
      }
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      let profilePhotoURL = "";
      if (profilePhoto) {
        const profileRef = ref(storage, `users/${uid}/profilePhoto_${profilePhoto.name}`);
        await uploadBytes(profileRef, profilePhoto);
        profilePhotoURL = await getDownloadURL(profileRef);
        await updateProfile(userCredential.user, {
          displayName: fullName,
          photoURL: profilePhotoURL,
        });
      }

      const panURL = panCard ? await uploadBytesAndGetURL(uid, "panCard", panCard) : null;
      const addressProofURL = addressProof ? await uploadBytesAndGetURL(uid, "addressProof", addressProof) : null;
      const landDocURL = landDoc ? await uploadBytesAndGetURL(uid, "landDoc", landDoc) : null;
      const businessDocURL = businessDoc ? await uploadBytesAndGetURL(uid, "businessDoc", businessDoc) : null;

      const userData = {
        uid,
        fullName,
        email,
        phone,
        role,
        profilePhotoURL,
        consentGiven: consent,
        createdAt: serverTimestamp(),
        approved: role === "Farmer" || role === "Cottager" ? false : true,
      };

      if (role === "Farmer") {
        userData.aadhaar = aadhaar;
        userData.panCardURL = panURL;
        userData.addressProofURL = addressProofURL;
        userData.landDocURL = landDocURL;
        userData.bankDetails = bankDetails;
        userData.productDesc = productDesc;
      }

      if (role === "Cottager") {
        userData.businessName = businessName;
        userData.businessDocURL = businessDocURL;
        userData.panCardURL = panURL;
        userData.addressProofURL = addressProofURL;
        userData.bankDetails = bankDetails;
        userData.productDesc = productDesc;
      }

      if (role === "Buyer") {
        userData.address = address;
        userData.preferences = preferences;
      }

      await setDoc(doc(db, "users", uid), userData);

      setSuccess("Registration successful! Pending admin approval if applicable.");
    } catch (err) {
      console.error(err);
      setError(errorMessageMap[err.code] || err.message);
    }
  };

  const uploadBytesAndGetURL = async (uid, folder, file) => {
    const fileRef = ref(storage, `users/${uid}/${folder}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  return (
    <div className="registration-container">
      <div className="registration-form-wrapper">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <select value={role} onChange={e => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="Farmer">Farmer</option>
            <option value="Cottager">Cottager</option>
            <option value="Buyer">Buyer</option>
          </select>

          <div>
            <label htmlFor="profilePhoto">Upload Profile Photo</label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={e => setProfilePhoto(e.target.files[0])}
              required
            />
          </div>

          {role === "Farmer" && (
            <>
              <input
                type="text"
                placeholder="Aadhaar Number"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                required
              />
              <div>
                <label htmlFor="farmerPanCard">Upload PAN Card (PDF or Image)</label>
                <input
                  type="file"
                  id="farmerPanCard"
                  accept="application/pdf,image/*"
                  onChange={e => setPanCard(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label htmlFor="farmerAddressProof">Upload Address Proof (Utility Bill - PDF or Image)</label>
                <input
                  type="file"
                  id="farmerAddressProof"
                  accept="application/pdf,image/*"
                  onChange={e => setAddressProof(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label htmlFor="landDoc">Upload Land Ownership Document (PDF or Image)</label>
                <input
                  type="file"
                  id="landDoc"
                  accept="application/pdf,image/*"
                  onChange={e => setLandDoc(e.target.files[0])}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Bank Account Details (e.g., Account Number, IFSC)"
                value={bankDetails}
                onChange={e => setBankDetails(e.target.value)}
                required
              />
              <textarea
                placeholder="Describe your farm products (e.g., 'Organic vegetables, seasonal fruits')"
                value={productDesc}
                onChange={e => setProductDesc(e.target.value)}
                required
              />
            </>
          )}

          {role === "Cottager" && (
            <>
              <input
                type="text"
                placeholder="Business/Shop Name"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                required
              />
              <div>
                <label htmlFor="businessDoc">Upload Business Registration Document (PDF or Image)</label>
                <input
                  type="file"
                  id="businessDoc"
                  accept="application/pdf,image/*"
                  onChange={e => setBusinessDoc(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label htmlFor="cottagerPanCard">Upload PAN Card (PDF or Image)</label>
                <input
                  type="file"
                  id="cottagerPanCard"
                  accept="application/pdf,image/*"
                  onChange={e => setPanCard(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label htmlFor="cottagerAddressProof">Upload Address Proof (Utility Bill - PDF or Image)</label>
                <input
                  type="file"
                  id="cottagerAddressProof"
                  accept="application/pdf,image/*"
                  onChange={e => setAddressProof(e.target.files[0])}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Bank Account Details (e.g., Account Number, IFSC)"
                value={bankDetails}
                onChange={e => setBankDetails(e.target.value)}
                required
              />
              <textarea
                placeholder="Describe your handmade products (e.g., 'Hand-woven baskets, natural soaps')"
                value={productDesc}
                onChange={e => setProductDesc(e.target.value)}
                required
              />
            </>
          )}

          {role === "Buyer" && (
            <>
              <input
                type="text"
                placeholder="Delivery Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <textarea
                placeholder="Product Preferences (optional, e.g., 'Organic produce, specific crafts')"
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
              />
            </>
          )}

          <label htmlFor="consentCheckbox" className="consent-label">
            <input
              type="checkbox"
              id="consentCheckbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              required
            />{" "}
            I agree to the Marketplace Policy
          </label>

          <button type="submit">Register</button>
        </form>

        <p className="login-prompt">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
