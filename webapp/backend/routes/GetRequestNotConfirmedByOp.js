const express = require("express");
const router = express.Router();
const axios = require('axios');
const {verifyTokenRequest} = require("../utils/jwtHelper");

router.get("/requests-not-confirmed-by-op",verifyTokenRequest,
    async (req, res) => {
        const user = req.user

        if(user.OrgName != "Org2"){
            res.status(403).send("Not Authorized")
        }


        const opid = req.params.opid

        const response =
            await axios.get(
                "http://localhost:3003/query?" +
                "channelid=mychannel&chaincodeid=requestManage&function=GetRequestByOp&args=" + opid)

        res.status(200).send(response.data)
    })

module.exports = router