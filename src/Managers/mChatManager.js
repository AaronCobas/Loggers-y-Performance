import mongoose, { startSession } from "mongoose";
import config from "../config/config.js";
const connection =  mongoose.connect(`mongodb+srv://${config.mongo.USER}:${config.mongo.PWD}@codercluster.qyce1yj.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`, err=>{
    if(err) console.log(err);
    else console.log("Connected to Mongo on mChatManager.js")
})



const schema = new mongoose.Schema({
id:{
    type:String,
},
messages:{
    type:Array,
}
})

const chatModel = mongoose.model("chats",schema)

// await chatModel.create({id:"mensajes",messages:[]})
export default class mChatManager{

    addChat = async(message)=>{
        await chatModel.updateOne({id:"mensajes"}, {$push:{messages:{message}}})
    }

    allChat = async()=>{
        const chats = await chatModel.find({id:"mensajes"})
        return chats
    }
}