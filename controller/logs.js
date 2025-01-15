const { logsService } = require("../Services/services");

class logsController{

    getAll  = async(req , res)=>{
        try{
          let option = {};
        //   if(req.user.role==="Employee"){
        //       option['user'] = req.user._id
        //   }  
          const logs = await logsService.find(option).populate([{path:'user', select:'email'}, {path:'to' , select:'email'}]).sort({createdAt:1});
          return res.status(200).send(logs);
        }catch(err){
            console.log(err);
        }
    }

    create  = async(req , res)=>{
        try{
          
        }catch(err){
            console.log(err);
        }
    }

    delete  = async(req , res)=>{
        try{
          const {id} = req.params;
          await logsService.findByIdAndDelete(id);
          return res.status(200).send({message:'Log Deleted Successfully'});
        }catch(err){
            console.log(err);
        }
    }

}



module.exports.logsController = new logsController();