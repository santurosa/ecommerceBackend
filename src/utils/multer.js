import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (file.fieldname === 'profile') cb(null, __dirname + '/public/profiles')
            if (file.fieldname === 'thumbnail') cb(null, __dirname + '/public/products')
            if (file.fieldname === 'documents') cb(null, __dirname + '/public/documents')
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        try {            
            if (file.fieldname === 'documents') cb(null, `${Date.now()}-${req.params.uid}-${file.originalname}`)
            if (file.fieldname === 'profile') cb(null, `${req.params.uid}-profile.${file.mimetype.split('/')[1]}`)
            if (file.fieldname === 'thumbnail') {
                if(req.body.id) {
                    cb(null, `${Date.now()}-${req.body.id}-${file.originalname}`)
                } else throw new Error(`Error identifying id of product, received ${req.body.id}`)
            }
        } catch (error) {
            cb(error);
        }
    }
})

export const uploader = multer({ storage });