const mongoose=require('mongoose')
const userschema=mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    }, 
  lastname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    socketId:{
        type:String,
    }
})
module.exports=mongoose.model('user',userschema)