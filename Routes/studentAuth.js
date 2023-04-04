const express = require('express'),
    requestIp = require('request-ip'),
    router = express.Router();

const { Router } = require('express');
const authService = require('../Services/studentAuth');

function sendParameterMissing(res) {
    res.send({ "statusCode": 401, "statusMessage": "Parameters are missing" });
}

/** API to update access token, device details */
router.put("/update-access-token", (req, res) => {
    if (!req.body.student_id) {
        sendParameterMissing(res);
        return;
    }

    let ip = req.ip || requestIp.getClientIp(req) || "IP ADDRESS MISSING";
    ip = ip.replace("::ffff:", "");

    authService.updateAccessToken(
        {
            student_id: req.body.student_id,
            access_token: req.headers.access_token,
            device_name: req.body.device_name,
            device_version: req.body.device_version,
            timezone: req.body.timezone,
            ip: ip,
        },
        data => res.send(data))
        .then()
        .catch();
});

/* Student Login via email. */
router.post('/login', (req, res) => {

    if (!req.body.email) {
        sendParameterMissing(res);
        return;
    }

    let ip = req.ip || requestIp.getClientIp(req) || "IP ADDRESS MISSING";
    ip = ip.replace("::ffff:", "");
    req.body.ip = ip;

    authService.loginWithEmail(req.body, req, res, (data) => {
        res.send(data);
    });
});

/* Student Login via phone. */
router.post('/login-with-phone', (req, res) => {

    if (!req.body.phone) {
        sendParameterMissing(res);
        return;
    }

    let ip = req.ip || requestIp.getClientIp(req) || "IP ADDRESS MISSING";
    ip = ip.replace("::ffff:", "");
    req.body.ip = ip;

    authService.loginWithPhone(req.body, (data) => {
        res.json(data);
    });
});

module.exports = router;