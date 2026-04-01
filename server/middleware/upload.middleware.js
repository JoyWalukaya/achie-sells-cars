import multer from 'multer'
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinary.js'

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    }
})

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'achie-sells-cars' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        )
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

export const uploadImages = (req, res, next) => {
    const multerUpload = upload.array('images', 10)

    multerUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }

        if (!req.files || req.files.length === 0) {
            req.uploadedImages = []
            return next()
        }

        try {
            const uploadPromises = req.files.map(file =>
                uploadToCloudinary(file.buffer)
            )
            req.uploadedImages = await Promise.all(uploadPromises)
            next()
        } catch (error) {
            res.status(500).json({ message: 'Image upload failed' })
        }
    })
}