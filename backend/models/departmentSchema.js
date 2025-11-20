const models = require("mongoose")

const departmentSchema = new models.Schema({
    departmentName: {
        type: String,
        required: true,
    },
    school: {
        type: models.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    subjects: [{
        type: models.Schema.Types.ObjectId,
        ref: 'subject',
    }],
    teachers: [{
        type: models.Schema.Types.ObjectId,
        ref: 'Teacher',
    }],
    students: [{
        type: models.Schema.Types.ObjectId,
        ref: 'student',
    }],
    teachClass: [{
        type: models.Schema.Types.ObjectId,
        ref: 'sclass',
    }],
}, { timestamps: true });
module.exports = models.model("department", departmentSchema)   