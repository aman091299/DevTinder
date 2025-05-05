
const validate=(req)=>{
    const {firstName,gender,skills,lastName,age,about}=req.body;


    if(age &&age <=  10){
     return  res.status(201).json({success: false,message:"Age must be greater than 10"});
   }
   
   
    if(firstName?.length > 20  || firstName?.length < 2){
        return  res.status(201).json({success: false,message:"First name should be between 3 to 10 charactor only"});
   }
   if(lastName?.length > 20  ||  lastName?.length <  2){
    return  res.status(201).json({success: false,message:"Last name should be between 3 to 10 charactor only"});
      
  }
   if(gender && !['male','female','others'].includes(gender?.toLowerCase())){
       
       return  res.status(201).json({success: false,message:"Gender should only include male,female and others"});
   }
   if(skills && skills?.length < 0 || skills?.length > 10){
       
       return  res.status(201).json({success: false,message:"Include at least 3 skills and at most 10 "});
   }
   const count = (about) => about.trim().split(/\s+/).length;
   if(count > 250){
    return  res.status(201).json({success: false,message:"No of word in about must be less than 250 "});
   }
}

module.exports=validate;