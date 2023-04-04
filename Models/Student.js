const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const studentSchema = new Schema({

    // unique id of the student
    student_id: {
        type: mongoose.Schema.ObjectId,
        index: true,
    },

    // first name of the student
    first_name: {
        type: String,
        trim: true,
        required: true
    },

    // last name of the student
    last_name: {
        type: String,
        required: true
    },

    // email id of the student
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },


    // phone number of the student without country code
    phone: {
        type: Number,
        trim: true,
        index: true,
        unique: true,
        default: ""
    },

    // phone number of the student with country code Eg: +61222222222
    phone2: {
        type: String,
        trim: true,
        default: ""
    },

    // hash value of the password
    password: {
        type: String,
        trim: true,
        //select: false,
    },

    // user's date of birth
    date_of_birth: {
        type: String,
        trim: true,
        default: ""
    },

    /**0 for Male, 1 for Female */
    gender: {
        type: Number,
        trim: true,
        default: 0
    },

    // country code of the phone number. it's an object and has phone_code as key.
    country_code: {
        type: Object,
        trim: true
    }, // Eg: country_code: { phone_code: "+61"}

    // profile picture of the user
    image: {
        type: String,
        trim: true,
        default: ""
    },

    // education of the user
    education: {
        type: String,
        trim: true,
        default: ""
    },

    // self description of the user
    about_you: {
        type: String,
        trim: true,
        default: ""
    },



    // mobile firebase device token of the user. used for notification purpose
    device_token: {
        type: String,
        trim: true,
        default: ""
    },


    /** 1 for ios, 2 for android */
    device_type: {
        type: Number,
        trim: true
    },

    // verification status of phone number
    phone_number_verified: {
        type: Boolean,
        default: true
    },

    // verification status of email id
    email_verified: {
        type: Boolean,
        default: false
    },



    // unique referral code of the user
    referal_code: {
        type: String,
        trim: true,
        unique: true,
    },


    // whether the profile has been issued approval by admin
    student_approval_status: {
        type: Boolean,
        default: true
    },

    // if true, the account is deleted.
    // if false, the account is not deleted.
    account_deleted: {
        type: Boolean,
        default: false
    },

    // active profile or deactivated profile
    // it's determined by the user
    account_status: {
        type: Boolean,
        default: true,
    },

    // whether the account is put on hold by admin
    account_on_hold: {
        type: Boolean,
        default: false,
    },

    // variable used for api purpose
    access_token: {
        type: String,
        default: "",
    },

    // record creation time
    created_date: {
        type: Date,
    },



    // user's app version
    app_version: String,



    // user's device name
    device_name: {
        type: String,
        default: "",
    },

    // user's device name
    device_version: {
        type: String,
        default: "",
    },

    // latest timezone of the user
    timezone: String,


    last_app_opened_time: Number,

    last_recorded_ip_address: String,

    last_recorded_location: {
        type: Object
    },
});

studentSchema.index({ student_id: 1, access_token: 1 });

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  

module.exports = mongoose.model('Student', studentSchema);