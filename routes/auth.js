const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/keys")
const requireLogin = require("../middleware/requirelogin")


router.post("/signup", (req, res) => {
  const {
    name,
    email,
    password,
    pic
  } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({
      error: "fill all the feilds"
    });
  }

  User.findOne({
      email: email
    })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "email already exists"
        });
      }
      bcrypt.hash(password, 12)
      .then(hashedpassword =>{
        const user = new User({
          email,
          password:hashedpassword,
          name,
          pic
        })
        user.save()
          .then(user => {
            res.json({
              message: "saved Sucessfully"
            })
          })
          .catch(err => {
            console.log(err);
          })
      })  
    })
    .catch(err => {
      console.log(err);
    })
})

router.post("/signin", (req, res)=>{
   const {email, password} = req.body
   if(!email || !password){
     return res.status(422).json({error: "please add email or password"})
   }
   User.findOne({email:email})
   .then(savedUser=>{
     if(!savedUser){
       return res.status(422).json({error: "Invalid email or password"})
     }
     bcrypt.compare(password, savedUser.password)
     .then(doMatch=>{
       if(doMatch){
        //  res.json({message:"sucessfully signed in"})
        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
        const {_id, name, email, followers, following, pic} = savedUser
        res.json({token, user:{_id, name, email, followers, following, pic}})
       }
       else{
        return res.status(422).json({error: "Invalid email or password"})
       }
     })
     .catch(err=>{
       console.log(err);
     })
   })
})

module.exports = router;