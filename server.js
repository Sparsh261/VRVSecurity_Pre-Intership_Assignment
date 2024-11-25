const mongoose = require('mongoose')
require('dotenv').config()
const app = require('./app.js')


const url = process.env.MONGO_URL
const dataBaseUser = process.env.dataBaseUser
const dataBasePassword = process.env.dataBasePassword
const dataBaseName = process.env.dataBaseName

let dbLink = url.replace("_USERNAME_",dataBaseUser)
dbLink =  dbLink.replace("_PASSWORD_",dataBasePassword)
dbLink =  dbLink.replace("_DATABASENAME_",dataBaseName)

mongoose.connect(dbLink)
.then(()=>{
    console.log("DataBase COnnected")
}).catch((err)=>console.log(err))

app.listen(process.env.PORT,()=>console.log("App Started"));