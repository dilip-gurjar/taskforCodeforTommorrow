const express=require("express");
require("./config/mongodb.js");
const app=express();

require("dotenv").config();
// const router=required("./routes.js")
const router=require("./routes/authRoute.js")
const cookieParser=require("cookie-parser");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api",router)

app.get("/",(req,res)=>{
    res.send("server is running properly")
})

app.listen(8080,(req,res)=>{
    console.log("app is listening on port 8080");

})