const express = require('express');
const { taskController } = require('../controller/task');
const Auth = require('../middlewares/Auth');


const router = express.Router();

const validHR = (req , res, next)=>{
    if(req.user.role==="HR"){
        next();
    }else{
        return res.status(401).send({message:"user unauthorized"});
    }
}

const validateEmployee = (req , res, next)=>{
    if(req.user.role==="Employee"){
        next();
    }else{
        return res.status(401).send({message:"user unauthorized"});
    }
}

router.get('/' , taskController.getAllTask);
router.get('/mytodo' , [Auth , validateEmployee] , taskController.mytodo)
router.get('/:id' , taskController.getSingleTask);
router.post('/create' ,[Auth , validHR ] , taskController.create);
router.post('/update/:id' ,[Auth  ] , taskController.update);
router.post('/delete/:id' ,[Auth , validHR ] , taskController.delete);


module.exports.taskRouter = router;