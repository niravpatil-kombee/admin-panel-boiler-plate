import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/products'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

export const uploadProductImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
}).any();
