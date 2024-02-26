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


        const fileData = fs.readFileSync(path);

        // Calculate hash of the file
        const hash = crypto.createHash('sha256');
        hash.update(fileData);
        const fileHash = hash.digest('hex');

        hash.setEncoding("hex")

        console.log(hash)
        try {
            /*const config = {
                method: 'post',
                url: 'https://example.com/upload', // Change this URL to your endpoint
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            };


                // Send the POST request
            const response = await axios(config);
            console.log(response.data);*/




            const args = id + "," + ipAddress + "," + description +
                "," + fileHash + "," + path + "," + true + "," + "Org2" + "," + category

            let data = {
                "channelid": "mychannel",
                "chaincodeid": "requestManage",
                "function": "AddRequest",
                "args": args
            }


            try {
                const response = await axios.post('http://localhost:3003/invoke', data,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                console.log('Response:', response.data);
                res.status(200).send(response.data.toString())
            } catch (error) {
                console.log(error)
                res.status(501).send('Request error');
            }
        }catch(error){
            console.log(error)
            res.status(501).send('Request error');
        }


        console.log(req.body)

    //res.send({"result":"ok"});

})

module.exports = router