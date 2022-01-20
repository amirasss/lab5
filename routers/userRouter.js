const fs = require("fs");
const { validateUser } = require('../userHelpers')
const express = require("express");
const router = express.Router();
var jwt = require('jsonwebtoken');
const {logRequest}=require('../generalHelpers')
const { v4: uuidv4 } = require("uuid");
const User=require('../models/User')
const {auth}=require('../middlewares/auth')
const serverConfig=require('../serverConfig');
const req = require("express/lib/request");
require("../mongoConnect")

router.post('/', async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const user=new User({username,age,password})
        await user.save();
        res.send({message: 'sucess' });
    } catch (error) {
        next({ status: 422, message: error.message })
    }

})

router.patch('/:userId', async (req, res, next) => {
    if(req.user.id!==req.params.userId) next({status:403,message:"Autherization error"})
    try {
        
        const {password,age}=req.body
        // const dbRes=await User.updateOne({_id:req.user.id},{$set:{password,age}})
        req.user.password=password
        req.user.age=age
        await req.user.save();
        res.send("sucess")

    } catch (error) {
        
    }
})
router.get('/', auth,async (req, res, next) => {
    try {
        const query=req.query.age ? {age:req.query.age} :{} 
        const users= await user.find(query,{password:0})
        res.send(users)
    } catch (error) {
        next({ status: 500, internalMessage: error.message })
    }

})

router.post('/login', async (req, res, next) => {
    const { username, age, password } = req.body;
    const user=await User.findOne({username})
    if (!user) return next({ status: 400, message: "username or password wrong"})
    if(user.password !==password) next({ status: 400, message: "username or password wrong"})
     const payload={id:user.id}
    const token=jwt.sign(payload,serverConfig.secret,{expiresIn:'1h'});
     return   res.status(200).send({message:"login sucess",token})
})
router.get('/id', async (req, res, next) => {
    const users = await fs.promises
        .readFile("./user.json", { encoding: "utf8" })
        .then((data) => JSON.parse(data));
        res.send(users);
})

router.delete('/:id', async(req,res,next)=>{
    await User.deleteOne({
        _id: req.params.id
       })
        .then(() => {
         req.body = { status: 'user Deleted!' }
        })
        .catch(err => {
         req.body = 'error: ' + err
        })
})

module.exports = router