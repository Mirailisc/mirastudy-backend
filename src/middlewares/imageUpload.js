import multer from 'multer'
import path from 'path'
const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, __dirname + '/public/static/uploads/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

export const upload = multer({storage: storage})