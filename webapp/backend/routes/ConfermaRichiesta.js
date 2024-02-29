const express = require("express");
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path')
const {verifyToken, verifyTokenRequest} = require("../utils/jwtHelper");
const fs = require('fs')
const crypto = require('crypto');

router.post("/confirm-request", verifyTokenRequest,
    async (req, res) =>{

        let user = req.user
        let id =  req.body.idRequest
        console.log(req.body)
        console.log(id)

        const args = id + "," + user.OrgName
        let data = {
            "channelid": "mychannel",
            "chaincodeid": "requestManage",
            "function": "Confirm",
            "args": args
        }


        try {
            const token = req.header("Authorization");

            const response = await axios.post('http://localhost:3004/invoke', data,
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



    console.log(req.body)

    //res.send({"result":"ok"});

})

module.exports = router