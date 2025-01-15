const Joi = require("joi");
const { taskService } = require("../Services/services");
const { Logs } = require("../models/Logs.model");
const { io } = require("..");
const mongoose = require('mongoose');
const { Task } = require("../models/Task.model");

const validateTask = Joi.object({
    title:Joi.string().required().min(3).max(100).message({
        "string.empty":"title can't be empty",
        "string.min":"min 3 character required",
        "string.max":"maximum 100 character required",
        "any.required":"title is required"
    }),
    description:Joi.string().optional().allow(""),
    assaignTo:Joi.optional()

})


class taskController{
    getAllTask = async(req , res)=>{
        try{
          let filter={};
          console.log(req.query);
          if(req.query?.search){
            filter['$or'] = [
              { title: { $regex: req.query.search, $options: "i" } },
              { description: { $regex: req.query.search, $options: "i" } },
              {assaignedName : {$regex:req.query.search , $options:"i"}}
            ];
          }
          if(req.query?.status) filter['status'] = req.query?.status
          if(req?.query?.assaignTo)filter['assaignTo._id'] =  new mongoose.Types.ObjectId(req.query.assaignTo);
          // const tasks = await  taskService.find(filter).populate([{path:'assaignTo',select:'email'}]).sort({createdAt:-1});
          // console.log("filter:" , filter);


          const tasks = await Task.aggregate([

            {
              $lookup:{
                from:"users",
                localField:"assaignTo",
                foreignField:"_id",
                as:"assaignTo"
              }
            },
            {
              $unwind:"$assaignTo"
            },
            {
              $addFields:{
                assaignedName:"$assaignTo.email",
              }
            },
            {
              $match:filter
            },
            {
              $project:{
                "assaignTo.password": 0,
                "assaignTo.role": 0  
              }
            }
          ])
          return res.status(200).send(tasks);

        }catch(err){
            console.log(err);
        }
    }


    getSingleTask = async(req , res)=>{
        try{
          const {id}=req.params;
          const task = await taskService.findById(id).populate([{path:'assaignTo' , select:'email'} , {path:'createdBy' , select:'email'}]);
          return res.status(200).send(task);
        }catch(err){
            console.log(err);
        }
    }

    mytodo=async(req , res)=>{
      try{
       const tasks = await taskService.find({assaignTo:req.user._id}).populate({path:'assaignTo' , select:'email'});
       return res.status(200).send(tasks);
      }catch(err){
        console.log(err);
      }
    }
    create = async(req , res)=>{
        try{
          
          const { error, value } = validateTask.validate(req.body, { abortEarly: false });

          if (error) {
            return res.status(400).json({
              message: "Validation failed",
              errors: error.details.map((detail) => detail.message),
            });
          }

          let newTask = await taskService.create({...req.body , createdBy:req.user._id});
          const newLog = {
            title:`${req.user.email} has assaigned a task to`,
            user:req.user._id,
            to:req.body.assaignTo
          }
          let newLogata =  await Logs.create(newLog);
          await newLogata.populate([{path:'user' , select:'email'} , {path:'to' , select:'email'}])
          console.log(newLogata);

          io.emit('new task' ,  newLogata);

          return res.status(200).send(newTask);
        }catch(err){
            console.log(err);
        }
    }
    update= async(req ,res)=>{
        try{
          const {id} = req.params;
          console.log(req.body);
         let updated = await taskService.findByIdAndUpdate(id , {...req.body , updatedAt:new Date()} , {upsert:false});
         console.log(updated);
    
         let newLogData;

         if(req.body?.status && req?.body?.status.toString()!==updated.status.toString()){

          const newLog={
            title:`changed a status to ${req.body.status} (${updated.title})`,
            user:req.user._id,  
        }
        newLogData =  await Logs.create(newLog);
        await newLogData.populate([{path:'user' , select:'email'} , {path:'to' , select:'email'}])
        io.emit('new task' , newLogData);
         }
         if(req.body?.assaignTo && req.body.assaignTo.toString()!==updated.assaignTo.toString()){
            const newLog={
                title:` ${req.user.email} has assaigned a task to `,
                user:req.user._id,  
                to:req.body.assaignTo
            }
           newLogData =  await Logs.create(newLog);
           await newLogData.populate([{path:'user' , select:'email'} , {path:'to' , select:'email'}])
           io.emit('new task' , newLogData);
           console.log(newLogData);
            // io code
            
         }

          return res.status(200).send({message:'updated successfully'});
        }catch(err){
            console.log(err);
        }
    }

    delete = async(req , res)=>{
        try{
          const {id} = req.params.id;
          await taskService.findByIdAndDelete(id);
          // io code
          return res.status(200).send({message:'deleted successfully'});
        }catch(err){
            console.log(err);
        }
    }
}


module.exports.taskController = new taskController();