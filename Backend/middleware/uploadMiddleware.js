import multer from 'multer'

// Configure multer with size limits
const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 4 // Maximum 4 files
    }
})

export default upload