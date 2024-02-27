const express = require("express");
const router = express.Router();
const axios = require('axios');
const {verifyTokenRequest} = require("../utils/jwtHelper");

router.get("/requests",verifyTokenRequest,
    async (req, res) => {

    /*const user = req.user

    console.log(user.OrgName)*/

    const response =
            await axios.get(
                "http://localhost:3003/query?channelid=mychannel&chaincodeid=requestManage&function=GetAllRequest")

        res.status(200).send(response.data)
    })

module.exports = router