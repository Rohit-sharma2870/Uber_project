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


exports.postlogin = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
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

      const user = await usermodel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // ✅ Save user info in session
      req.session.isloggedin = true;
      req.session.user = {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
        socketId: user.socketId || null,
      };

      req.session.save(() => {
        // ✅ Send only safe user info
        const safeUser = {
          _id: user._id,
          firstname: user.firstname,
          email: user.email,
        };
        res.status(200).json({ message: 'Login successful', user: safeUser });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error while logging in' });
    }
  },
];

exports.authcheck = (req, res) => {
  if (req.session?.user) {
    res.status(200).json({ 
      loggedin: true, 
      user: req.session.user
    });
  } else {
    res.status(401).json({ loggedin: false });
  }
};

exports.logout=(req,res)=>{
  req.session.isloggedin=false;
  req.session.user='';
  res.status(200).json({message:"logged out "})
}
