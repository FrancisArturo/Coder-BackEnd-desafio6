import { Router } from "express";
import UserManager from "../dao/managers/dbManagers/user.manager.js";
import passport from "passport";



export default class sessionRoutes {
    path = "/session";
    router = Router();
    userManager = new UserManager();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/register`, passport.authenticate ("register", {
            successRedirect: "/views/login",
            failureRedirect: "/views/failregister",
            failureFlash: true,
        }),
        async (req, res) => {
            res.send("User added successfully");
        }
        );

        this.router.get(`${this.path}/failregister`, (req, res) => {
            res.send("User already exists");
        }
        );

        this.router.post(`${this.path}/login`, passport.authenticate ("login", {
            failureRedirect: `/api/v1/session/failedlogin`,
        }),
        async (req, res) => {
            if (!req.user) {
                return res.status(400).json({ message: "User not found" });
            }
            req.session.user = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                role: req.user.role,
            };
            return res.redirect("/views/home");
        }
        );
        this.router.get(`${this.path}/failedlogin`, (req, res) => {
            res.send("failed login");
        }
        );
        this.router.get(`${this.path}/logout`, async (req, res) => {
            req.session.destroy( (err) => {
                if (!err) {
                    return res.redirect("/views/login");
                }
                return res.status(400).json({ message: err.message });
            });
        }
        );
        this.router.post(`${this.path}/recover`, async (req, res) => {
            try {
                const user = await this.userManager.recoverPassword(req.body);
                if (user === "User not found") {
                    return res.render("recover", {error: "User not found"});
                }
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                };
                return res.redirect("/views/login");
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.get(`${this.path}/github`, passport.authenticate("github", { scope: ["user:email"] }));
        this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/api/v1/session/failedlogin" }),
            async (req, res) => {
                try {
                    req.session.user = {
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        email: req.user.email,
                        role: req.user.role,
                    };
                    return res.redirect("/views/home");
                } catch (error) {
                    return res.status(400).json({ message: error.message });
                }
            }
        );
    }
}

