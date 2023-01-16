import mongoose, { startSession } from "mongoose";
import config from "../config/config.js";
const connection =  mongoose.connect(`mongodb+srv://${config.mongo.USER}:${config.mongo.PWD}@codercluster.qyce1yj.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`, err=>{
    if(err) console.log(err);
    else console.log("Connected to Mongo on mLoginUser.js")
})

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("Users",schema)

export default userModel