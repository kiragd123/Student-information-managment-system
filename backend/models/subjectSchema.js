const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
    },
    subCode: {
        type: String,
        required: true,
    },
    sessions: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
   department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'department',
            required: true,
        },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        
    },
       sclassName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sclass',
            required: true,
        },
        
}, { timestamps: true });

module.exports = mongoose.model("subject", subjectSchema);