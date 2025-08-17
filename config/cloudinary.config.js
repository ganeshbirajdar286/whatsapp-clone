import  multer from "multer"
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
import fs from "fs"
import { resourceUsage } from "process";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,// Click 'View API Keys' above to copy your API secret
});

/////////////////////////
// Uploads an image file
/////////////////////////
export const uploadFileToCloudinary = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      resource_type:file.mimetype.startWith("video")?"video":"image",
    };

    try {
      // Upload the image
      const uploader =file.mimetype.startWith("video")?cloudinary.uploader.upload_large:cloudinary.uploader.upload
       const result =await uploader(file.path,options)
       fs.unlinkSync(file.path)
      return result;
    } catch (error) {
      fs.unlinkSync(file.path) // remove the locally saved temporary file  as the upload operation got failed
             return null;
    }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  }, 
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const multerMiddleWare=multer({storage}).single("media")