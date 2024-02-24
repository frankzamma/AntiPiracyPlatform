const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post("/save-request", upload.single('file'),
    async (req, res) =>{

    //console.log(req.file.path)
    console.log(req.body)

    res.send({"result":"ok"});

})

module.exports = router