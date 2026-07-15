const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true

    },
    refreshToken:{
        type:String,
        default:null
    }
});

const User=mongoose.model("user",userSchema);

module.exports=User;