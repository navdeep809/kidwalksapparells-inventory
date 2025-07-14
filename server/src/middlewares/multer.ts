// middlewares/multer.ts
import multer from "multer";

const storage = multer.memoryStorage();
// This keeps files in memory for manual upload
export const upload = multer({ storage });
