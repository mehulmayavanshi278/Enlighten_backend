const { BasicService } = require("./BasicService");
const User = require("../models/User.model");
const { Task } = require("../models/Task.model");
const { Logs } = require("../models/Logs.model");



class userServices extends BasicService {
  constructor() {
    super(User);
  }
}


class taskService extends BasicService{
  constructor(){
    super(Task)
  }
}
class logsService extends BasicService{
  constructor(){
    super(Logs)
  }
}





module.exports.userServices = new userServices();
module.exports.taskService = new taskService();
module.exports.logsService = new logsService();


