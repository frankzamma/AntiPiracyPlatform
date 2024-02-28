const express = require("express");
const router = express.Router();
const axios = require('axios');
const {verifyTokenRequest} = require("../utils/jwtHelper");

router.get("/requests-by-op",verifyTokenRequest,
    async (req, res) => {
        const user = req.user

        if(user.OrgName != "Org2"){
            res.status(403).send("Not Authorized")
        }


        const opid = req.query.opid
        /*const user = req.user

        console.log(user.OrgName)*/
        const token = req.header("Authorization");
        const response =
            await axios.get(
                "http://localhost:3003/query?" +
                "channelid=mychannel&chaincodeid=requestManage&function=GetRequestNotConfirmedByOp&args=" + opid,
                {
                    headers: {
                        'authorization': token
                    }
                })

        res.status(200).send(response.data)
    })

module.exports = router