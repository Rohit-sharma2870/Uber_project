const mongoose=require('mongoose')
const capitanschema=mongoose.Schema({
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
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive",
    },
    vehicle:{
        colour:{
            type:String,
            required:true,
        },
        plate:{
            type:String,
            required:true,
        },
        vehicletype:{
            type:String,
            required:true,
            enum:['motorcycle','auto','car']
        },
        capacity:{
            required:true,
            type:Number,
            min:[1]
        }
    },
location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    default: [0, 0]
  }
},
  socketId:{
        type:String,
    }
})
capitanschema.index({ location: "2dsphere" });
module.exports=mongoose.model('capitan',capitanschema)