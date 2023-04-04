const mongoose = require('mongoose');
mongoose.set('debug', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
const {seedUsers} = require("../database/seeders/seed");

const config = require("../Utilities/config").config;

// https://stackoverflow.com/questions/16226472/mongoose-autoreconnect-option/

mongoose.Promise = global.Promise;

let isConnectedBefore = false;
const connect = async function () {
    try {
        console.log('Connecting to DB...', config.DB_URL.url_full);
        await mongoose.connect(config.DB_URL.url_full,
            {
                useNewUrlParser: true,
                auto_reconnect: true,
            });
            /* seedUsers(); */
        console.log('DB connected.');
    } catch (e) {
        throw e;
    }
};

mongoose.connection.on('error', function (error) {
    console.log(`Could not connect to MongoDB: ${error}`);
});

mongoose.connection.on('disconnected', function () {
    console.log('Lost MongoDB connection...');
    if (!isConnectedBefore)
        connect();
});
mongoose.connection.on('connected', function () {
    isConnectedBefore = true;
    console.log('Connection established to MongoDB');
});

mongoose.connection.on('reconnected', function () {
    console.log('Reconnected to MongoDB');
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Force to close the MongoDB connection');
        process.exit(0);
    });
});

module.exports = {
    connect
}