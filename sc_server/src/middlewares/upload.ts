import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "smartcoin_user_imgs",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  }),
});


const parser = multer({ storage: storage });

export default parser;