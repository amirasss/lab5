const mongoose = require('mongoose');
console.log("Mongoose requit");
mongoose.connect('mongodb://localhost:27017/testlab5').then(()=>{
    console.log("connect");
});