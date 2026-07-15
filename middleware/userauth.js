const jwt=require("jsonwebtoken");
const userauth=async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false,message:"not authorized login again "});

    }

    try{
   
    const tokendecode=jwt.verify(token,process.env.JWT_SECRET);

    if(!tokendecode.id){
        return res.json({success:false,message:"not authorized login  "});
    }

    req.user={userId:tokendecode.id};
    next();
         
}catch(err){
    if(err.name==="TokenExpiredError"){
        return res.json({
            success:false, 
            message:"token expired,login again"
        });
    }

    return res.json({success:false, message:err.message});
}
}

module.exports=userauth;