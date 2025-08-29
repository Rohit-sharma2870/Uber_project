const {body,validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
const usermodel=require('../models/usermodel')
exports.userregister=[
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
    //confirm password
//     body('confirmpassword')
//     .trim()
//     .custom((value,{req})=>{
// if(value!==req.body.password){
// throw new Error('password donot match')
// }
// return true;
//     }),
async(req,res,next)=>{
   try {
     const{firstname,lastname,email,password}=req.body;
     const errors=validationResult(req)
       if (!errors.isEmpty()) {
    return res.status(400).json({ errors:errors.array().map((error)=>error.msg),oldinputs:{
    firstname,lastname,email,password
    }});
  }
  else{
   const isalreadyexist= await usermodel.findOne({email:email})
   if(isalreadyexist){
       res.json({message:"user already exist"})
   }
   else{
   bcrypt.hash(password,10).then(async(hashedpassword)=>{
    const user=await usermodel.create({
      firstname,
      lastname,
      email,
      password:hashedpassword,
    })
     res.json(user)
    })
   }
  }
   } catch (error) {
    res.json(error)
    res.json({message:"error while user login"})
   }
}]
exports.postlogin=[
  body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
   .isLength({min:8})
    .withMessage('password must be atleast  8 characters long').trim()
  ,async (req,res,next)=>{
    try {
         const{email,password}=req.body;
         const errors=validationResult(req)
       if (!errors.isEmpty()) {
    return res.status(400).json({ errors:errors.array().map((error)=>error.msg),oldinputs:{
      email,password
    }});
  }
  else{
 const user=await usermodel.findOne({email:email});
 if(!user){
res.status(400).json({message:"invalid email or password"})
 }
 else{
    const ismatch= await bcrypt.compare(password,user.password);
    if(!ismatch){
    res.status(400).json({message:"invalid email or password"})
    }
    else{
        req.session.isloggedin=true
        req.session.user = {
  _id: user._id,
  firstname: user.firstname,
  email: user.email,
  socketId: user.socketId || null
};
        req.session.save(() =>{
        res.status(200).json(user);
      });   
    }
 }
  }
    } catch (error) {
      res.status(400).json({message:'error while login'})
    }
}]

exports.authcheck = (req, res) => {
  console.log('Session:', req.session); 
  if (req.session.user){
    res.status(200).json({ loggedin: true });
  } else {
    res.status(401).json({ loggedin: false });
  }
};
exports.logout=(req,res)=>{
  req.session.isloggedin=false;
  req.session.user='';
  res.status(200).json({message:"logged out "})
}
