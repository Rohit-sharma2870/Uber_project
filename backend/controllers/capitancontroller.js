const {body,validationResult}=require('express-validator')
const capitanmodel=require('../models/capitan-model')
const bcrypt=require('bcryptjs')
exports.register=[
//firstname
  body('firstname').trim().isLength({ min: 3 }).withMessage(' firstname must be at least 3 characters long').matches(/^[a-zA-Z\-']+$/)
    .withMessage('firstname contains only letters'),
    //lastname
body('lastname').trim().matches(/^[a-zA-Z\-']+$/)
    .withMessage('laststname contains only letters'),
body('email').isEmail().withMessage('Enter a valid email'),
//check password
  body('password')
   .isLength({min:8})
    .withMessage('password must be atleast  8 characters long')
    .matches(/[a-z]/)
    .withMessage('password must contain atleast a lower case letter')
    .matches(/[A-Z]/)
    .withMessage('password must contain atleast one upper case letter')
    .matches(/[!@#$%^&*()]/)
    .withMessage('password must contain aleast one special character')
    .trim(),
//     //confirm password
//     body('confirmpassword')
//     .trim()
//     .custom((value,{req})=>{
// if(value!==req.body.password){
// throw new Error('password donot match')
// }
// return true;
//     }),
    body('vehiclecolour').isLength({min:3}).withMessage('vehicle colour must have atleast 3 character'),
     body('vehicleplate').isLength({min:3}).withMessage('vehicle number must have atleast 3 character'),
     body('capacity').isInt({min:1}).withMessage('capacity must be  atleast 1'),
     body('vehicletype').isIn(['car','motorcycle','auto']).withMessage('invalid vehicle type')
,async(req,res,next)=>{
    try {
const{firstname,lastname,email,password,vehiclecolour,vehicleplate,capacity,vehicletype}=req.body;
console.log(firstname,lastname,email,password,vehiclecolour,vehicleplate,capacity,vehicletype)
 const errors=validationResult(req)
       if (!errors.isEmpty()) {
    return res.status(400).json({ errors:errors.array().map((error)=>error.msg),oldinputs:{
    firstname,lastname,email,password,vehiclecolour,vehicleplate,capacity,vehicletype
    }});
  }
  else{
const isalreadyexist= await capitanmodel.findOne({email:email})
if(isalreadyexist){
    res.status(409).json({message:"user already exist"})
}
else{
     bcrypt.hash(password,10).then(async(hashedpassword)=>{
     const capitan=await capitanmodel.create({
    firstname,
    lastname,
    email,
    password:hashedpassword,
  vehicle:{
    colour:vehiclecolour,
    plate:vehicleplate,
    capacity:capacity,
    vehicletype:vehicletype,
  },
   })
   res.json(capitan)
  })   
}
  }
    } catch (error) {
res.json({message:"error while creating capitan"})
    }
}]

exports.postlogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .trim(),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => error.msg),
          oldinputs: { email, password },
        });
      }

      const capitan = await capitanmodel.findOne({ email });
      if (!capitan) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const ismatch = await bcrypt.compare(password, capitan.password);
      if (!ismatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Save only safe data into session
      req.session.isloggedin = true;
      req.session.capitan = {
        _id: capitan._id,
        firstname: capitan.firstname,
        email: capitan.email,
        socketId: capitan.socketId || null,
      };

      req.session.save(() => {
        console.log("Capitan session after login:", req.session);
        res.status(200).json({
          message: "Capitan login successful",
          capitan:capitan,
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error while capitan login", error: error.message });
    }
  },
];

exports.logout=(req,res,next)=>{
  req.session.isloggedin=false
  req.session.capitan=" "
  res.status(200).json({message:" capitan logout"})
}
exports.getprofile=(req,res,next)=>{
    res.json(req.session.capitan)
}

exports.authcheck = (req, res) => {
  console.log('Session:', req.session); 
  if (req.session.capitan) {
    res.status(200).json({ loggedin: true });
  } else {
    res.status(401).json({ loggedin: false });
  }
};