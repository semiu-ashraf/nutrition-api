const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
        Minimum:13
    }
},{timestamps:true})


let userModel = mongoose.model("users",userSchema);



module.exports = userModel;



















let nutritionSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        maximum:7000
    },
    cookedBy:{
        type:String,
        enum:["Fry,Boil,Grill,Cook"]
    }
    
},{timestamps:true})