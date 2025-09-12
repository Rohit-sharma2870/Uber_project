const express=require('express')
const riderouter=express.Router()
const ridecontroller=require('../controllers/ridecontroller')
const {capitanauth,userauth}=require('../middlewares/authmiddleware')
const{body,query}=require('express-validator')
riderouter.post('/createride',
  userauth,
      body('pickup').isString().isLength({min:3}).withMessage('invalid pickup address'),
      body('destination').isString().isLength({min:3}).withMessage('invalid destination address'), 
      body('vehicletype').isString().isIn(['auto','car','motorcycle']).withMessage('invalid vehicletype'),
    ridecontroller.createride)
  
  
    riderouter.get('/getfare',
      userauth,
      query('pickup').isString().isLength({min:3}).withMessage('invalid pickup address'),
      query('destination').isString().isLength({min:3}).withMessage('invalid destination address'),
      ridecontroller.getfare,
    )

    riderouter.post('/confirm-ride',
    body('rideid').isMongoId().withMessage(' invalid rideid'),
    ridecontroller.confirmride
    )
    riderouter.post('/start-ride',
      body('rideid').isMongoId().withMessage('invalid rideid'),
      body('otp').isString().isLength({min:6,max:6}).withMessage('invalid otp'),
      ridecontroller.startride
    )

    riderouter.post('/finish-ride',
       body('rideid').isMongoId().withMessage('invalid rideid'),
      ridecontroller.finishride
    )
    module.exports=riderouter