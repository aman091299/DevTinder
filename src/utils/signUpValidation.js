
const validator = require("validator");

const SignUpValidation=(req)=>{
  const {firstName,lastName,emailId,password}=req.body;

if(!firstName && !lastName){
    return  res.status(201).json({success: false,message:"First name and Last name required"});
}
  
    if(firstName?.length > 20  || firstName?.length < 2){
        return  res.status(201).json({success: false,message:"First name should be between 3 to 10 charactor only"});
   }
   if(lastName?.length > 20  ||  lastName?.length <  2){
    return  res.status(201).json({success: false,message:"Last name should be between 3 to 10 charactor only"});
    }

    if(!emailId){
        return res.status(201).json({success: false,message:"email id is required"});

    }
    if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1 })) {
          return res .status(201).json({success: false,message:"Password is not strong enough. It must contain at least 8 characters, a symbol, a number, and both uppercase and lowercase letters."} );
        }

}

module.exports=SignUpValidation;