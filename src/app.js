import express from "express"
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js"
import loginRouter from "./routes/login&register.js"
import mChatRouter from "./routes/mChat.router.js"
import objectProcessRouter from "./routes/objectProcess.js"
import productsManager from "./Managers/productManager.js"
import ChatManager from "./Managers/chatManager.js";
import { Server } from "socket.io";
import containerSQL from "./Container/containerSQL.js"
import sqliteOptions from "./dbs/knex.js";
import { generateProduct } from "./Managers/productFaker.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js"
import { addLogger } from "./utils/logger.js";
import cluster from "cluster"
import os from "os";


const app = express();
const CPUs = os.cpus().length;

// if(cluster.isPrimary){
//     console.log("Proceso primario ejecutándose con PID " + process.pid)
//     for(let i=0;i<CPUs;i++){
//         cluster.fork();
//     }
//     cluster.on("exit",()=>console.log("Proceso muerto"))
// }else{
//     console.log("Proceso worker ejecutado con PID "+process.pid)
//     app.listen(config.app.PORT,()=>console.log("Listening on "+ config.app.PORT))
// }

app.use(express.static(__dirname+"/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(addLogger)
app.set("views",__dirname+"/public");
app.set("view engine","ejs");


app.use(session({
    store:MongoStore.create({
        mongoUrl:`mongodb+srv://${config.mongo.USER}:${config.mongo.PWD}@codercluster.qyce1yj.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`,
        ttl:600,
    }),
    secret:`${config.sessions.SECRET}`,
    saveUnitialized:false,
    resave:false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session())

app.get("/",async(req,res)=>{
    res.render("index")
});
const productsService = new productsManager();
app.use("/api/productos",productsRouter);
app.use("/",mChatRouter)
app.use("/", loginRouter)
app.use("/",objectProcessRouter)
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, ()=>console.log(`Escuchando en ${PORT}`))
const io = new Server(server);

const productSQL = new containerSQL(sqliteOptions, "products")
const messagesSQL = new containerSQL(sqliteOptions, "messages")
const messages = []
app.get("/productos",async(req,res)=>{
    let productos = await productSQL.getAll();
res.render("productos",
{
    productos
}
)
});

app.get("/*",(req,res)=>{
    req.logger.warning("Se entró a una ruta inexistente con el método "+ req.method +": " + req.url)
})

app.get("/chat",(req,res)=>{
    res.render("chat");
})
const chatService = new ChatManager();
// io.on("connection", async socket=>{
//     let productos = await productSQL.getAll()
//     socket.emit("productos", await productSQL.getAll())

//     socket.on("message", async data=>{
//         await messagesSQL.addProduct(data);
//         const messagesC = await messagesSQL.getAll();
//         io.emit("logs",messagesC);
//     })
//     socket.emit("logs", await messagesSQL.getAll());
//     socket.on("authenticated",data=>{
//         socket.broadcast.emit("newUserConnected", data);
//     })
// })
