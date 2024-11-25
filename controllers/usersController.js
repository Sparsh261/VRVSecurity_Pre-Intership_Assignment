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

    const tempUser = await usersModel.findOne({ email });

    try {
        if (tempUser) {
            res.json({
                status: "failed",
                msg: "User Exists"
            })
        }

        else {

            const { name, email, password, position } = req.body;
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
                    position: position,
                    authToken: authToken
                })
                res.json({
                    status: "success",
                    msg: "User Added"
                })
            }
            catch (err) {
                res.json({
                    status: err,
                    msg: err.message
                })
            }
        }

    }

    catch (err) {

        req.json({
            error: err
        })
    }
}

const verifyUsers = async (req, res) => {
    const { email, password, position } = req.body;
    const user = await usersModel.findOne({ email });

    try {
        if (!user) {
            res.json({
                status: "false",
                msg: "No Account Found"
            })
        }
        else if(position != user.position){
            res.json({
                status: "false",
                msg: "You are not"+position
            })
        }
        else {
            const chkPass = await bcrypt.compare(password, user.password);

            if (chkPass) {
                res.json({
                    status: "true",
                    user: user,
                    authToken: user.authToken
                })
            }
            else {
                res.json({
                    status: "false",
                    msg: "Invalid Credentials"
                })
            }
        }
    }
    catch (err) {
        req.json({
            error: err
        })
    }
}

const verifyAccessUsers = async (req, res) => {
    const { authToken } = req.body;
    const user = await usersModel.findOne({ authToken });
    const position = user.position;
    try {
        if (position === "user") {
            res.json({
                status: "failed",
                msg: "Permission Denied"
            })
        }
        else {
            res.json({
                status: "success",
                msg: "Permission granted"
            })
        }
    }
    catch (err) {
        req.json({
            error: err
        })
    }
}

module.exports = {
    getAllUsers,
    addUsers,
    verifyUsers,
    verifyAccessUsers
}