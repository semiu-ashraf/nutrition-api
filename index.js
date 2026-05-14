const express =  require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const mongoUri = process.env.MONGO_URI;
const secretKey = process.env.NUT_SECRET;

const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const verifyToken = require("./verifyToken");
const trackModel = require("./models/trackModel");


mongoose.connect(mongoUri)
.then(()=>{
    console.log("Connected to MongoDB at nutrifier");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


const app = express();
app.use(express.json());
app.use(cors());

// user registration
app.post("/register",(req,res)=>{

    let user = req.body;

    bcrypt.genSalt(10,(err,salt)=>{

        if(!err)
        {
            bcrypt.hash(user.password,salt,(err,hashPass)=>{

                if(!err)
                {
                    user.password = hashPass;
                    userModel.create(user)
                    .then((data)=>{
                        // res.send(data);
                        res.send({message:"User registration successful"});
                    })
                    .catch((err)=>{
                        console.log(err)
                        res.status(500).send({message:"Error while registering user"})
                    })
                }
                else
                {
                    res.send({message:"Unable to hash password"})
                }

            })
        }
        else
        {
            res.send({message:"Error while generating salt"})
        }
    })

})

// endpoint for user login
app.post("/login",async (req,res)=>{

    let userCred = req.body;

    try
    {
        let user = await userModel.findOne({email:userCred.email})

        if(user)
        {
            bcrypt.compare(userCred.password,user.password,(err,result)=>{

                if(result)
                {
                    jwt.sign({email:userCred.email},secretKey,(err,token)=>{
                        if(err===null)
                        {
                            res.send({token:token, document:user, userid:user._id});
                        }
                        else
                        {
                            res.status(500).send({message:"Error while assigning token"})
                        }
                    })
                    
                }
                else
                {
                    res.status(403).send({message:"Incorrect password"})
                }
            })
        }
        else
        {
            res.status(404).send({message:"User not found"})
        }
    }
    catch(err)
    {
        console.log(err)
        res.status(404).send({message:"User not found"});

    }
})


// endpoint for foods

// to create or add foods
app.post("/foods",async (req,res)=>{

    try
    {
        let meal = req.body;
        let food = await foodModel.create(meal)
        res.send(food)
    }
    catch(err)
    {
        // res.send(err)
        console.log(err)
    }

})

// get all foods
app.get("/foods",verifyToken,async (req,res)=>{

    try
    {
        let foods = await foodModel.find()
        res.send(foods);
    }
    catch(err)
    {
        res.status(500).send({message:"Unable to get food collection"});
    }
})

// search food by name
app.get("/foods/:name",verifyToken,async (req,res)=>{

    try
    {
        let food = await foodModel.find({name:{$regex:req.params.name, $options:"i"}})

        if(food!==null)
        {
            res.send(food)
        }
        else
        {
            res.status(500).send({message:"Food not found"})
        }
    }
    catch(err)
    {
        res.status(500).send({message:"Food not found"})
    }
    

})


// tracking endpoints

app.post("/track",verifyToken,async (req,res)=>{

    try
    {
        let foodEaten = req.body;
        let meal = await trackModel.create(foodEaten)
        res.send({message:"Food has been added"})
    }
    catch(err)
    {
        res.status(404).send({message:"Food not found"})
        console.log(err)
    }

})


// food eaten by individuals
app.get("/track/:userId/:date",verifyToken,async (req,res)=>{

    let userId = req.params.userId;
    let date = new Date(req.params.date);
    let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

    try
    {
        let data = await trackModel.find({user:userId,eatenDate:strDate}).populate("user").populate("food")
        res.send(data);
    }
    catch(err)
    {
        res.status(404).send({message:"Food or User not found"})
        console.log(err)
    }

})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


// async (params) => {
    
// }

console.log(PORT , mongoUri)