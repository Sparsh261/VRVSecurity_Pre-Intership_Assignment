const usersModel = require('../models/usersModels.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtSecretKey = process.env.jwtSecretKey;

const getAllUsers = async (req, res) => {
    const allUsers = await usersModel.find();
    res.send(allUsers)
}

const addUsers = async (req, res) => {
    
    const { name, email, password, role } = req.body;
    const tempUser = await usersModel.findOne({ email });

    try {
        if (tempUser) {
            res.json({
                status: "failed",
                msg: "User Exists"
            })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secretPassword = await bcrypt.hash(password, salt);

            const data = {
                user: {
                    email: email
                }
            }
            const authToken = jwt.sign(data, jwtSecretKey);
            
            try {
                await usersModel.create({
                    name: name,
                    email: email,
                    password: secretPassword,
                    role: role,
                    authToken: authToken
                })
                res.json({
                    status: "success",
                    msg: "User Added"
                })
            }
            catch (err) {
                res.json({
                    status: "failed",
                    msg: err.message
                })
            }
        }
    }
    catch (err) {

        req.json({
            status: "failed",
            msg: err.message
        })
    }
}

const verifyUsers = async (req, res) => {
    const { email, password, role } = req.body;
    const user = await usersModel.findOne({ email });

    try {
        if (!user) {
            res.json({
                status: "failed",
                msg: "No Account Found"           //  No user found
            })
        }
        else if(role != user.role){
            res.json({
                status: "failed",
                msg: "You are not "+role+"."        //  Role is different
            })
        }
        else {

            const chkPass = await bcrypt.compare(password, user.password);
            if (chkPass) {
                res.json({
                    status: "success",
                    authToken: user.authToken          //  Password matched
                })
            }
            else {
                res.json({
                    status: "failed",
                    msg: "Invalid Credentials"          //  Password not matched
                })
            }
        }
    }
    catch (err) {
        console.log(err.msg)
        req.json({
            status: "failed",
            msg: err.message
        })
    }
}

const verifyAccessUsers = async (req, res) => {
    const { authToken } = req.body;
    const user = await usersModel.findOne({ authToken });
    const role = user.role;
    try {
        res.json({
            status: "success",
            role: role
        })
    }
    catch (err) {
        req.json({
            msg: err
        })
    }
}




const getValues = async (req, res) => {         // To send values to frontend

    const fsPromises = require('fs/promises');
    const db = await fsPromises.readFile('controllerValues.json','utf-8');
    const arr = JSON.parse(db);

    try {
        res.json({
            "status":"success",
            "adminCount": arr.adminCount,
            "moderatorCount": arr.moderatorCount,
            "userCount": arr.userCount
        })
    }
    catch (err) { 
        res.json({
            msg: err.message
        })
    }
}


const incrementValues = async (req, res) => {           // To increment values

    const fsPromises = require('fs/promises');
    const { adminCount, moderatorCount, userCount } = req.body;
     
    const arr = {
        "adminCount": adminCount,
        "moderatorCount": moderatorCount,
        "userCount": userCount
    }
    fsPromises.writeFile('controllerValues.json',JSON.stringify(arr))

    res.json({
        status:"success"
    })
}

module.exports = {
    getAllUsers,
    addUsers,
    verifyUsers,
    verifyAccessUsers,
    getValues,
    incrementValues
}