import dotenv from "dotenv"

dotenv.config();

export default {
    app:{
        PORT : process.env.APP_PORT
    },
    mongo:{
        USER : process.env.MONGO_USER,
        PWD : process.env.MONGO_PASSWORD,
        DB: process.env.MONGO_DB,
    },
    sessions:{
        SECRET: process.env.SESSION_SECRET
    }
}