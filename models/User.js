const mongoose =require('mongoose');
const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:25,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:3,
        max:25,
    },
    age:Number

});
const User=mongoose.model('User',userSchema)
module.exports=User