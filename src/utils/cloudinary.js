import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPLOAD FILES
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file is uploaded on cloudinary", response.url); // url is coming we have checked
    fs.unlinkSync(localFilePath);   // if file successfully uploaded, remove from local
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); 
    return null;
  }
};

export { uploadOnCloudinary };
