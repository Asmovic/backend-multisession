const util = require('../Utilities/util'),
    studentDAO = require('../DAO/studentDAO'),
    crypto = require('crypto'),
    { createAndSendToken } = require('../Utilities/token');

/**
 * This api is used to update the student's access token.
 * Also updates the user's device details in the db.
 * Returns student sign up location as well.
 * @param student_id id of the student
 * @param access_token current access token
 * @param device_name user's device manufacturer and model
 * @param device_version user's device sdk/release version
 * @param timezone latest timezone of the user
 * @param {String} ip ip address of the user
 * @param cb new access_token if mongoose query is successful
 */
const updateAccessToken = async ({
    student_id,
    access_token,
    device_name,
    device_version,
    timezone,
    ip,
}, cb) => {

    const new_token = randomIdGenerator();

    let sData;

    try {

        const dataToSet = {
            access_token: new_token,
            device_name: device_name || "",
            device_version: device_version || "",
            timezone: timezone || "",
            last_app_opened_time: new Date().getTime(),
            last_recorded_ip_address: ip || "",
        };

        sData = studentDAO.updateStudentAsync(
            {
                student_id,
                access_token
            }, dataToSet
            , {});



        sData = await sData;
    } catch (e) {
        console.log(e);
        cb(util.statusResponseObjects.serverBusy);
        return;
    }

    if (!sData) {
        cb({
            "statusCode": util.statusCode.FIVE_ZERO_ZERO,
            "statusMessage": util.statusMessage.LOGIN_EXPIRED
        });
        return;
    }

    let lat;
    let lng;

    try {
        lat = sData.location.coordinates[1];
        lng = sData.location.coordinates[0];
    } catch (e) {
        lat = -33.8708;
        lng = 151.2073;
    }


    cb({
        "statusCode": util.statusCode.OK,
        "statusMessage": util.statusMessage.DATA_UPDATED,
        access_token: new_token,
        lat: lat,
        lng: lng,
        account_status: sData.account_status || false,
    });
};

/** API to login student using email id **/
const loginWithEmail = (data, req, res, cb) => {

    studentDAO.getStudent({ email: data.email }, {
        student_id: 1,
        password: 1,
        student_approval_status: 1,
        account_on_hold: 1,
        _id: 1
    }, {}, (err, dbData) => {
        if (sendServerBusy(err, cb)) {
            return;
        }

        if (dbData.length === 0) {
            console.log("length zero");
            cb({
                "statusCode": util.statusCode.FOUR_ZERO_ONE,
                "statusMessage": util.statusMessage.EMAIL_NOT_EXISTS
            });
            return;
        }


        util.decryptPasswordAsync(data.password, dbData[0].password, (err, passResult) => {
            if (sendServerBusy(err, cb)) {
                return;
            }

            if (passResult.result === false) {
                cb({
                    "statusCode": util.statusCode.FOUR_ZERO_ONE,
                    "statusMessage": util.statusMessage.INCORRECT_PASSWORD
                });
                return;
            }

            if (dbData[0].student_approval_status === false || dbData[0].account_on_hold) {
                cb({
                    "statusCode": util.statusCode.FOUR_ZERO_ONE,
                    "statusMessage": util.statusMessage.ACCOUNT_LOCKED
                });
                return;
            }

            const token = createAndSendToken({id: dbData[0]._id, email: dbData[0].email }, req, res);


            const criteria = {
                student_id: dbData[0].student_id,
            };

            const dataToSet = {
                $set: {
                    access_token: token,
                    app_version: data.app_version ? data.app_version : "",
                    last_app_opened_time: new Date().getTime(),
                    last_recorded_ip_address: data.ip || "",
                    device_name: data.device_name || "",
                    device_version: data.device_version || "",
                }
            };
            
            studentDAO.updateStudent(criteria, dataToSet, {}, function (err, updatedStudent) {
                if (sendServerBusy(err, cb)) {
                    return;
                }

                const result = {
                    first_name: updatedStudent.first_name,
                    last_name: updatedStudent.last_name,
                    referal_code: updatedStudent.referal_code,
                    student_id: updatedStudent.student_id,
                    image: updatedStudent.image,
                    country_code: updatedStudent.country_code,
                    access_token: updatedStudent.access_token,
                    account_status: updatedStudent.account_status
                };

                


                cb({
                    "statusCode": util.statusCode.OK,
                    "statusMessage": util.statusMessage.LOGGED_IN,
                    "result": result,
                    "token": token
                });

            });
        })
    });

};

/** Student login with phone.
 * It also checks whether the student is a new user or existing user
 */
const loginWithPhone = (data, cb) => {

    data.phone = data.phone.replace(/\s+/g, '');

    const criteria = {
        phone: data.phone
    };

    if (!data.token) {
        sendServerBusy("err", cb);
        return;
    }

    goAhead().then().catch();

    async function goAhead() {

        studentDAO.getStudent(criteria, {
            _id: 0,
            student_id: 1,
            student_approval_status: 1,
            account_on_hold: 1,
        }, {}, (err, dbData) => {
            if (sendServerBusy(err, cb)) {
                return;
            }
            if (dbData && dbData.length) {

                if (dbData[0].student_approval_status === false || dbData[0].account_on_hold) {
                    cb({
                        "statusCode": util.statusCode.FOUR_ZERO_ONE,
                        "statusMessage": util.statusMessage.ACCOUNT_LOCKED
                    });
                    return;
                }

                const dataToSet = {
                    $set: {
                        access_token: randomIdGenerator(),
                        app_version: data.app_version || "",
                        last_app_opened_time: new Date().getTime(),
                        last_recorded_ip_address: data.ip || "",
                        device_name: data.device_name || "",
                        device_version: data.device_version || "",
                    }
                };

                studentDAO.updateStudent({ student_id: dbData[0].student_id }, dataToSet, {}, (err, updatedStudent) => {
                    if (sendServerBusy(err, cb)) {
                        return;
                    }

                    let result = {
                        first_name: updatedStudent.first_name,
                        last_name: updatedStudent.last_name,
                        referal_code: updatedStudent.referal_code,
                        student_id: updatedStudent.student_id,
                        image: updatedStudent.image,
                        country_code: updatedStudent.country_code,
                        access_token: updatedStudent.access_token,
                        account_status: updatedStudent.account_status
                    };


                    cb({
                        "statusCode": util.statusCode.OK,
                        "statusMessage": util.statusMessage.LOGGED_IN,
                        "result": result,
                    });
                });
            } else {
                cb({
                    "statusCode": util.statusCode.FOUR_ZERO_TWO,
                    "statusMessage": util.statusMessage.PHONE_NOT_REGISTERED,
                });
            }
        });
    }
};

/**
 * send error response to client
 * @param err error occurred
 * @param cb callback to the client
 * @returns {boolean} if error occurs, true is returned.
 * else false is returned.
 */
function sendServerBusy(err, cb) {
    if (err) {
        cb(util.statusResponseObjects.serverBusy);
        return true;
    } else {
        return false;
    }
}

function randomIdGenerator() {
    return crypto.randomBytes(30).toString('base64');
}

module.exports = {
    updateAccessToken,
    loginWithEmail,
    loginWithPhone,
}