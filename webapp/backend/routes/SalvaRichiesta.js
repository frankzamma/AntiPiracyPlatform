const express = require("express");
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path')
const {verifyToken, verifyTokenRequest} = require("../utils/jwtHelper");
const fs = require('fs')
const crypto = require('crypto');

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
        let id =  req.body.id
        let ipAddress = req.body.ipAddress
        let description = req.body.description
        let category = req.body.categoria

        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(path);


        //si calcola l'hash del file
        stream.on("error", error => {
            console.error(error)
            return res.status(501).send('Internal error');
        })
        hash.setEncoding("hex")
        let hashFile
        stream.on('end', () => {
            hash.end();

            hashFile = hash.read()
        });
        stream.pipe(hash);

        const request =  {
            "ID": id,
            "IpAddress": ipAddress,
            "Description": description,
            "Category": category,
            "HashImage": hashFile,
            "PathImage": path,
            "Verified" : true,
            "Confirmed" :{
                "Org2" : false
            }
        }






        let form = new FormData()

        form.set("channelid", "mychannel")
        form.set("chaincodeid", "requestManage")
        form.set("function", "AddRequest")
        form.set("args", id)
        form.set("args", ipAddress)
        form.set("args", description)
        form.set("args", hashFile)
        form.set("args", path)
        form.set("args", true)
        form.set("args", ["Org2"])
        form.set("args", category)


        axios.post('https://localhost:3003/invoke', form,{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
                console.log(response)
                res.send({response});
            })
            .catch(error => {
                res.status(501).send('Request error');
            });




        console.log(req.body)

    res.send({"result":"ok"});

})

module.exports = router