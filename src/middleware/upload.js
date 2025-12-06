import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    // Resume Upload
    if (file.fieldname === "resume") {
      folder = path.join(process.cwd(), "uploads/resumes");
    }
    // Logo Upload
    else if (file.fieldname === "logo") {
      folder = path.join(process.cwd(), "uploads/logos");
    }
    // Signature Upload
    else {
      folder = path.join(process.cwd(), "uploads/signatures");
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  }
});

// Allowed mime types
const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",

  "application/pdf",
  "application/msword",  // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDF, DOC, DOCX allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
