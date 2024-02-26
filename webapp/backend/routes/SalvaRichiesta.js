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


        const args =  id + "," + ipAddress + "," + description +
            "," + hashFile + "," +  path  + "," +  true + "," + "Org2" + "," +  category

        let data = {
          "channelid": "mychannel",
           "chaincodeid": "requestManage",
           "function": "AddRequest",
            "args": args
        }



        try{
            const response = await axios.post('http://localhost:3003/invoke', data,
                {            headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            console.log('Response:', response.data);
            res.status(200).send( response.data.toString())
        }catch(error){
            console.log(error)
            res.status(501).send('Request error');
        }




        console.log(req.body)

    //res.send({"result":"ok"});

})

module.exports = router