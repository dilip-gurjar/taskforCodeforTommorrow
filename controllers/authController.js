const usermodel=require("../models/usermodel.js")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const register=async(req,res)=>{
    const {name, password}=req.body;

    if(!name || !password){
        return res.json({success:false,message:"name and password is required"});
    }

    
try{

    const isuser= await usermodel.findOne({name});


    if(isuser){
        return res.json({success:false,message:"user is alredy exist "});
    }

        const hashedpassword= await bcrypt.hash(password,10);

        const newuser=new usermodel({
            name,
            password:hashedpassword
        });

                await newuser.save();
                console.log("new user saved");

                return res.json({success:true,message:"new user saved"});

                    
}catch(err){
    console.log(err.message);
}
};

const login=async(req,res)=>{
    const {name, password}=req.body;

    if(!name || !password){
        return res.json({success:false,message:"name and password is required"});
    }

    try{
    

    const isuser= await usermodel.findOne({name});

    if(!isuser){
        return res.json({success:false, message:"user is not registered"});
    }

    const ismatch=await bcrypt.compare(password,isuser.password);

    if(!ismatch){
        return res.json({success:false, message:"incorrect password"});
    }

    const token=jwt.sign({id:isuser._id},process.env.JWT_SECRET,{expiresIn:"1m"});

    const refreshToken=jwt.sign({id:isuser._id},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"});

    isuser.refreshToken=refreshToken;
    await isuser.save();


    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        maxAge:60*1000
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        maxAge:7*24*60*60*1000
    });

return res.json({success:true, message:"login successfull"});
    
}catch(err){
    console.log(err.message);
}

}


const profile=async(req,res)=>{
    try{

    const userId=req.user.userId;
    const isuser=await usermodel.findById(userId);
    console.log("you are on your profile");
    return res.json({success:true,isuser });
    }catch(err){
        return res.json({success:false, message:err.message});
    }
}





const refreshTokenAccess=async(req,res)=>{
    const {refreshToken}=req.cookies;
   if (!refreshToken){
    return res.json({success:false, message:"refresh token missing"});
   }
   try{
   
   const decode=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

   const user=await usermodel.findById(decode.id);

   if(!user){
    return res.json({success:false, message:"invalid user"});
   }
   if(user.refreshToken!==refreshToken){
    return res.json({success:false, message: "token not found"})
   }

   const newAccessToken=jwt.sign({id:decode.id},process.env.JWT_SECRET,{expiresIn:"1m"});
   res.cookie("token",newAccessToken,{
    httpOnly:true,
    maxAge:60*1000
   });

   return res.json({
    success:true, message:"new access token generated"
   });
    
}catch(err){
    return res.json({
        success:false,
        message:err.message
    });
}
}
 
module.exports={register, login,refreshTokenAccess ,profile};

