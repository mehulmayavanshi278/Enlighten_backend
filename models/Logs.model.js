const mongooose = require('mongoose');

const logsSchema = new mongooose.Schema({
    title:{
        type:String,
        required:true
    },
    user:{
        type:mongooose.Schema.Types.ObjectId,
        ref:'User'
    },
    to:{
        type:mongooose.Schema.Types.ObjectId,
        ref:'User'   
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports.Logs = mongooose.model('Logs' , logsSchema);