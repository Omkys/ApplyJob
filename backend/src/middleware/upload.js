import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype !== 'application/pdf') {
    return cb(new AppError('Only PDF files are allowed', 400));
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter,
}).single('resume');

export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Resume must be under 5MB', 400));
    }
    return next(new AppError(err.message, 400));
  }
  next(err);
}
