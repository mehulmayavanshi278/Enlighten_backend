const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:["HR" , "Employee"],
    default:"Employee",
  },
  password: {
    type: String,
  },
  lastLogin: { type: Date, default: Date.now },


});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  console.log(this.password);
  console.log(typeof this.password);
  if (!this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {_id:this._id ,  email:this.email , role:this.role },
    process.env.JSONTOKEN_SECRET_KEY
  );
  await this.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
