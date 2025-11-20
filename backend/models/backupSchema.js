
const mongoose = require('mongoose');

const backupSchema=new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    filePath: {
        type: String,
        required: true,
    },
    backupType: {
        type: String,
        enum: ["Full", "Differential", "Log"], // restrict to known values
        default: "Full",
    },
    backupSizeMB: {
        type: Number, // optional, store size in MB
    },
    createdBy: {
        type: String, // could be admin name or ID
        default: "System",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Completed", "Failed", "Pending"],
        default: "Pending",
    },
    notes: {
        type: String,
    }
})
module.exports=mongoose.model("Backup",backupSchema)