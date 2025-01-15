const express = require("express");
const { userController } = require("../controller/users");
const upload = require("../startup/multer.startup");
const router = express.Router();
const Auth = require("../middlewares/Auth");




router.get('/' ,  userController.getAllUsers);
router.post('/login' ,  userController.login);



module.exports.userRouter = router;
