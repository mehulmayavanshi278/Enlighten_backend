const { userServices } = require("../Services/services");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');





class userController {
  getAllUsers = async(req , res)=>{
    try{
      let filter={};
      if(req.query.role) filter['role'] = req.query.role;
      let data = await userServices.find(filter);
      return res.status(200).send(data);
    }catch(err){
      console.log(err);
    }
  }
  getUsers = async (req, res) => {
    const id = req.params.id || req.user._id;
    console.log(id);
    try {
      const data = await userServices.findById(id);
      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
    }
  };
  


  login  = async(req ,res)=>{
     try{
      console.log('c')
      const {email , role , password} = req.body;
      // console.log(role);
      let checkuser = await userServices.findOne({email});

      if(!checkuser){
        checkuser = await userServices.create({email , password , role});
        console.log('useris' , checkuser);
        const token = await checkuser.generateAuthToken();
        console.log("token is" , token);
        return res.status(200).send({token});
      }
      const checkpw = await bcrypt.compare(password , checkuser.password);
      console.log(checkpw);

      if(!checkpw) return res.status(401).send({message:'Invalid credentials '});
      
      const token = await checkuser.generateAuthToken();
      console.log("token is" , token);
      return res.status(200).send({token , role:checkuser.role});

     }catch(err){
      console.log(err);
     }
  }









  






}

module.exports.userController = new userController( );
