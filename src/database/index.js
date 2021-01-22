const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', { useMongoClient: true });
nongoose.Promise = global.Promise;

module.exports = mongoose;