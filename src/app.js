
import "dotenv/config";
import express from "express"
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import appRouter from "./routes/app.router.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import setupSocket from "./chat/socket.js";
import cors from 'cors'
import compression from "express-compression";


const PORT = 8080
const app = express()
app.use(cors())
const httpserver = app.listen(PORT, () => console.log("Server up."))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


mongoose.set('strictQuery', false) 
const connection = mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.hiwmxr5.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }) 

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.hiwmxr5.mongodb.net/ecommerce?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 5000
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.use(compression({ brotli: { enabled: true, zlib: {} } }));
app.use("/", appRouter)


app.engine('handlebars', handlebars.engine()) 
app.set('views', __dirname + '/views') 
app.set('view engine', 'handlebars') 
app.use(express.static(__dirname + '/public')) 


initPassport()
app.use(passport.initialize())
app.use(passport.session())


setupSocket(httpserver)



