const express = require("express");
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path')
const {verifyToken, verifyTokenRequest} = require("../utils/jwtHelper");
const fs = require('fs')
const crypto = require('crypto');
const mime = require('mime-types');


const fileFilter = async (req, file, cb) =>{
    try {
        const mimeType = mime.lookup(file.originalname); // Ottieni il tipo MIME dal nome del file

        if (mimeType && mimeType.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('FileType non accettato'), false);
        }
    } catch (error) {
        cb(error, false);
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer(
    { storage: storage,
            fileFilter: fileFilter
    });

router.post("/save-request", verifyTokenRequest, upload.single('file'),
    async (req, res) =>{

        let token = req.header("Authorization");
        let path = req.file.path

        if(path === undefined || path === null){
            res.status(400).send("Errore nei parametri!")
        }

        let id =  req.body.id

        if(id === undefined || id === null){
            res.status(400).send("Errore nei parametri!")
        }
        let ipAddress = req.body.ipAddress
        const ipPattern = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/

        if(ipAddress === undefined || ipAddress === null || !(ipPattern.test(ipAddress))){
            res.status(400).send("Errore nei parametri!")
        }

        let description = req.body.description

        let category = req.body.categoria
        if(category===undefined || category===null || !(category >=0 && category<=8)){
            res.status(400).send("Errore nei parametri!")
        }


        const fileData = fs.readFileSync(path);

        // Calculate hash of the file
        const hash = crypto.createHash('sha256');
        hash.update(fileData);
        const fileHash = hash.digest('hex');

        hash.setEncoding("hex")

        try {

            const response =
                await axios.get("http://127.0.0.1:5000/predict?url=http://localhost:3001/files/" + req.file.filename)

            console.log("Predizione: ", response.data)

            const OrgName = req.user.OrgName
            const args = id + "," + ipAddress + "," + description +
                "," + fileHash + "," + "files/" + req.file.filename + "," + (response.data.prediction == category) + "," + "Org2" + "," + category + "," + OrgName

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
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'authorization': token
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