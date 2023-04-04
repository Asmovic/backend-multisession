'use strict';

const Models = require('../Models/Student');

const updateStudent = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.findOneAndUpdate(criteria, dataToSet, options, callback);
};

const justUpdateStudent = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.updateOne(criteria, dataToSet, options, callback);
};

const justUpdateStudentAsync = function (criteria, dataToSet, options = {}) {
    options.lean = true;
    options.new = true;
    return Models.updateOne(criteria, dataToSet, options);
};

//Insert Student in DB
const createStudentAsync = function (objToSave) {
    return new Models(objToSave).save()
};

//Delete Student in DB
const deleteStudent = function (criteria, callback) {
    Models.findOneAndRemove(criteria, callback);
};

const getStudent = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.find(criteria, projection, options, callback);
};

const getStudentAsync = function (criteria, projection, options = {}) {
    options.lean = true;
    return Models.find(criteria, projection, options);
};

const getStudentOneAsync = function (criteria, projection, options = {}) {
    options.lean = true;
    return Models.findOne(criteria, projection, options);
}

const updateStudentAsync = function (criteria, dataToSet, options = {}) {
    options.lean = true;
    options.new = true;
    return Models.findOneAndUpdate(criteria, dataToSet, options);
};

const justUpdateStudentsAsync = function (criteria, dataToSet, options = {}) {
    options.lean = true;
    options.new = true;
    return Models.updateMany(criteria, dataToSet, options);
};

const getStudentCollectionAggregateAsync = function (aggQuery) {
    return Models.aggregate(aggQuery);
}

const getDistinctDataAsync = function (distinct_column, query = {}) {
    return Models.distinct(distinct_column, query)
}

const countDocumentsAsync = function (criteria) {
    return Models.countDocuments(criteria);
}

module.exports = {
    updateStudent: updateStudent,
    justUpdateStudent: justUpdateStudent,
    justUpdateStudentAsync: justUpdateStudentAsync,
    createStudentAsync,
    deleteStudent: deleteStudent,
    getStudent: getStudent,
    getStudentAsync: getStudentAsync,
    getStudentOneAsync: getStudentOneAsync,
    updateStudentAsync: updateStudentAsync,
    justUpdateStudentsAsync: justUpdateStudentsAsync,
    getStudentCollectionAggregateAsync,
    getDistinctDataAsync,
    countDocumentsAsync,
};
