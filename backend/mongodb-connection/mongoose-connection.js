const mongoose=require('mongoose')
mongoose.connect(process.env.mongo_URL).then(()=>{
    console.log('connected successfully')    
}).catch((err)=>{
    console.log('error while connecting')
})
module.exports=mongoose.connection