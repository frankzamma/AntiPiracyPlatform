const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path')
const {verifyToken, verifyTokenRequest} = require("../utils/jwtHelper");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post("/save-request", verifyTokenRequest, upload.single('file'),
    async (req, res) =>{

    let token = req.header("Authorization");
    let path = req.file.path
    let ipAddress = req.body.ipAddress
    let description = req.body.description




    console.log(req.body)

    res.send({"result":"ok"});

})

module.exports = router