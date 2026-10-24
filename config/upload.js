import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDir = path.join(__dirname, '../public/uploads');
fs.mkdirSync(uploadDir, {recursive: true});

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, uploadDir);
    },
    filename: function(req,file,cb){
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
    }
});

export const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if(file.mimetype.startsWith('image/')) return cb(null, true);
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'));
    }
});

// Remove an old uploaded file; ignores missing files
export const removeUpload = (filename) => {
    if(!filename) return;
    const filePath = path.join(uploadDir, path.basename(filename));
    fs.promises.unlink(filePath).catch(()=>{});
}
