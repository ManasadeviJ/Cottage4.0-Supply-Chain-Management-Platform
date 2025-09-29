import { auth, db, storage } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload file helper
const uploadFile = async (file, folder, userId) => {
  const fileRef = ref(storage, `${folder}/${userId}/${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

// Registration function
export const registerUser = async (formData) => {
  const { fullName, email, password, mobileNumber, userType, country, profilePhoto,
          aadhaarNumber, landDocument, bankAccount, kycDocuments, recentFarmPhoto, produceCategories, gstNumber,
          businessName, goodsCategory, businessID, address, productSamples,
          deliveryAddress, preferences, consent
        } = formData;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profilePhotoURL = "";
    if (profilePhoto) {
      profilePhotoURL = await uploadFile(profilePhoto, 'profilePhotos', user.uid);
      await updateProfile(user, { displayName: fullName, photoURL: profilePhotoURL });
    }

    let userData = {
      uid: user.uid,
      fullName,
      email,
      mobileNumber,
      userType,
      country,
      profilePhoto: profilePhotoURL || null,
      consent,
      createdAt: serverTimestamp(),
    };

    if (userType === 'Farmer') {
      const kycURLs = await Promise.all(kycDocuments.map(docFile => uploadFile(docFile, 'kycDocuments', user.uid)));
      const landDocURL = landDocument ? await uploadFile(landDocument, 'landDocuments', user.uid) : null;
      const recentPhotoURL = recentFarmPhoto ? await uploadFile(recentFarmPhoto, 'farmPhotos', user.uid) : null;

      userData = { ...userData, aadhaarNumber, landDocument: landDocURL, bankAccount, kycDocuments: kycURLs,
                   recentFarmPhoto: recentPhotoURL, produceCategories, gstNumber: gstNumber || null, approved: false };
    } 
    else if (userType === 'Cottager') {
      const kycURLs = await Promise.all(kycDocuments.map(docFile => uploadFile(docFile, 'kycDocuments', user.uid)));
      const sampleURLs = productSamples ? await Promise.all(productSamples.map(file => uploadFile(file, 'productSamples', user.uid))) : [];

      userData = { ...userData, businessName, goodsCategory, businessID, kycDocuments: kycURLs,
                   bankAccount, address, productSamples: sampleURLs, approved: false };
    } 
    else if (userType === 'Buyer') {
      userData = { ...userData, deliveryAddress, preferences: preferences || [] };
    }

    await setDoc(doc(db, 'users', user.uid), userData);

    return { success: true, message: 'Registration successful! Pending admin approval if applicable.' };
  } catch (error) {
    console.error('Registration Error:', error);
    return { success: false, message: error.message };
  }
};
