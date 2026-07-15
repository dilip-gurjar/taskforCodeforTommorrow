const express=require("express");
const router=express.Router();

const {register, login,refreshTokenAccess,profile}=require("../controllers/authController.js");
const userauth=require("../middleware/userauth.js")
router.post("/register",register);
router.post("/login",login);
router.post("/refresh-token",refreshTokenAccess);
router.post("/profile",userauth,profile);

module.exports=router;