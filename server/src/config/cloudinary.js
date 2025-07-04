import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createStorage = (folderName) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderName,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Optional: public_id logic for better control
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP allowed.'));
  }
};

const uploadOptions = {
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
};

export const categoryUpload = multer({ storage: createStorage('categories'), ...uploadOptions });
export const productUpload = multer({ storage: createStorage('products'), ...uploadOptions });