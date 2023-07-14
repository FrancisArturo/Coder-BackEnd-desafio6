import express from "express";
import displayRoutes from "express-routemap";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import  connectDB from "./db/mongo.config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import  { configConnection }  from "./db/mongo.config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


export default class App {
    app;
    port; 
    server;
    env;
    io;

    constructor (routes) {
        this.app = express();
        this.port = 8000;
        this.env = "development";
        this.API_VERSION = "v1";
        
        this.listen();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectDB();
        this.initHandlebars();
        
    }
    getServer() { 
        return this.server;
    }
    closeServer() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`)
            done ()
        })
    }
    getApp() {
        return this.app;
    }

    async connectDB() {
        await connectDB();
    }
    initializeMiddlewares() {
        //this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname + "/public"));
        this.app.use(cookieParser());
        this.app.use(session({
            store: MongoStore.create({
                mongoUrl: configConnection.url,
                mongoOptions: configConnection.options,
                ttl: 600,
            }),
            secret: "secretCode",
            resave: true,
            saveUninitialized: true
        }));
        initializePassport();
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    listen() {
        this.server = this.app.listen(this.port, () => {
            displayRoutes(this.app);
            console.log(`Server listening on port ${this.port}`);
            console.log(`Environment: ${this.env}`);
            return this.server
        });
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            if (route.path === "/views") {
                this.app.use(`/` , route.router);
            }else {
                this.app.use(`/api/${this.API_VERSION}`, route.router);
                console.log(route.path);
            }
        });
    }
    initHandlebars() {
        this.app.engine(
            "handlebars",
            handlebars.engine({
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true,
                    allowProtoMethodsByDefault: true,
                },
            })
        );
        this.app.set("view engine", "handlebars");
        this.app.set("views", __dirname + "/views");
    }
}