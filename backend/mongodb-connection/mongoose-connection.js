const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
  tls: true,
  tlsAllowInvalidCertificates: false
})
.then(() => {
    console.log('✅ MongoDB connected successfully')    
})
.catch((err) => {
    console.error('❌ Error while connecting:', err.message)
})

module.exports = mongoose.connection
