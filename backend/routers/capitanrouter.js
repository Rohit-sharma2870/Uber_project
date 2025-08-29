const express=require('express')
const capitanrouter=express.Router()
const capitancontroller=require('../controllers/capitancontroller')
capitanrouter.post('/register',capitancontroller.register)
capitanrouter.post('/login',capitancontroller.postlogin)
capitanrouter.post('/logout',capitancontroller.logout)
capitanrouter.post("/profile",capitancontroller.getprofile)
capitanrouter.get("/authcheck",capitancontroller.authcheck)
module.exports=capitanrouter