
const validate=(req)=>{
    const {firstName,gender,skills,lastName,age,about}=req.body;
   
    if(firstName?.length > 20  || firstName?.length < 2){
        throw new Error("First name should be between 3 to 10 charactor only");
   }
   if(lastName?.length > 20  ||  lastName?.length <  2){
       throw new Error("Last name should be between 3 to 10 charactor only");
  }
   if(!['male','female','others'].includes(gender?.toLowerCase())){
       throw new Error("Gender should only include male,female and others");
   }
   if(skills?.length < 3 || skills?.length > 10){
       throw new Error("Include at least 3 skills and at most 10 ")
   }
 
   if(about?.trim().split(/\s+/).length > 280){
       throw new Error("About content must be less than 280 word")
   }
   if(age <=  10){
       throw new Error("Age must be greater than 10");
   }

}

module.exports=validate;