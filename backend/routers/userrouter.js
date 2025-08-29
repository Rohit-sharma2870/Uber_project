const express=require('express')
const userrouter=express.Router()
const authcontroller=require('../controllers/authcontroller')
userrouter.get('/authcheck',authcontroller.authcheck)
userrouter.post('/register',authcontroller.userregister)
userrouter.post('/login',authcontroller.postlogin)
userrouter.get('/logout',authcontroller.logout)
module.exports=userrouter