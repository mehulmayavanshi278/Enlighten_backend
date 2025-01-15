const express  = require('express');
const Auth = require('../middlewares/Auth');
const { logsController } = require('../controller/logs');
const router = express.Router();



router.get('/' , [Auth] , logsController.getAll);
router.post('/delete/:id' , logsController.delete);



module.exports.logRouter = router;