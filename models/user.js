const mongoose= require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
       type: String,
       required: true
    },
    email:{
        type: String,
        required: true
     },
     password:{
        type: String,
        required: true
     },
     pic:{
       type:String,
       default:"https://res.cloudinary.com/ankitraj/image/upload/v1626072445/businessman-holding-paper-say-no-260nw-105617738_d7svva.jpg"
     },
     followers:[{type:ObjectId,ref:"User"}],
     following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User", userSchema)