const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        default:"Pending",
        enum:["Pending", "In Progress", "In Review" ,  "Completed"]
    },
    assaignTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
})



module.exports.Task = mongoose.model('Task' , taskSchema);