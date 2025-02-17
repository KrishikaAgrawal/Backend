import { v2 as cloudinary } from "cloudinary"; // the method we need is inside v2
import fs from "fs"; // already installed file with node for file handling

// CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPLOAD FILES
// localFilePath -> path of file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // if the local file path is not passed return null or can return error message
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      // pass options
      resource_type: "auto", // which resource you are passing
    }); // can pass other options, to get them, use " , space {}"

    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary", response.url); // get the url after upload
    return response; // or can pass response.url only
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
