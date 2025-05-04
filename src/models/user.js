const mongoose = require("mongoose");
const validator=require("validator")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 2,
    maxLength: 20,
    index:true,
    required: [true,"firstName is required"],
  },
  lastName: {
    type: String,
    minLength: 2,
    maxLength: 20,
    required:true
  },
  gender: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value.toLowerCase())) {
        throw new Error("Gender must be either 'male', 'female', or 'others'");
      }
    },
  },
  dob: {
    type: String,
    validate(value){
        if(!validator.isDate(value)){
            throw new Error('Invalid Date formate')
        }
    }

  },
  age: {
    type: Number,
    min: 10,
  
  },

  emailId: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true,"Email is required"],
    unique: true,
    validate(value){
     if(!validator.isEmail(value)){
        throw new Error("Invalid email format")
     }
    }
  },
  password: {
    type: String,
    required: true,
    trim:true,
    
  },
  photoUrl:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png"
  },
   skills:{
    type:[String],
    validate(value){
      if(value?.length < 0 || value?.length >10){
        throw new Error("3 skills must be provide and skill must be less than 10")
      }
  
    }
   }
   ,
   membershipType:{
    type:String,
},
isPremium:{
    type:Boolean,
    default:false,
    
},
   about:{
    type:String,
    default:"This is default about us",
    validate(value){
      if(value?.trim().split(/\s+/).length > 280){
        throw new Error("About content must be less than 280 word")
      }
   },
  }


},{
   timestamps: true
});

userSchema.methods.validatePassword=function (userInputPassword){
const user=this;

const hashPassword=user.password;

const isPasswordMatch=bcrypt.compare(userInputPassword,hashPassword);

return isPasswordMatch;
   
}

userSchema.methods.getJwt=async  function (){

  const user=this;
   //generating the json web token
  var token=await jwt.sign({_id:user._id},process.env.SECREAT_KEY,{expiresIn:'1d'})
  

  return token;

}

module.exports = mongoose.model("User", userSchema);
