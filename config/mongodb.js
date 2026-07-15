const mongoose=require("mongoose");
require("dotenv").config();
async function main(){
await mongoose.connect(process.env.MONGO_URL)
}

main().then(()=>{
    console.log("database connection success")
}).then((err)=>{
    console.log(err);
});