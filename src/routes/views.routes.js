import { Router } from "express";
import ProductsManager from '../dao/managers/dbManagers/products.manager.js';
import { authMdw } from "../middleware/auth.middleware.js";
import CartsManager from "../dao/managers/dbManagers/carts.manager.js";

export default class viewsRoutes {
    path = "/views";
    router = Router();
    productsManager = new ProductsManager()
    cartManager = new CartsManager()

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/login`, async (req, res) => {
            res.render("login");
        });
        this.router.get(`${this.path}/register`, async (req, res) => {
            res.render("register");
        });
        this.router.get (`${this.path}/recover`, async (req, res) => {
            res.render("recover");
        });
        this.router.get(`${this.path}/home`, authMdw, async (req, res) => {
            //query para buscar productos por categoria: frutas, lacteos o panificados
            const { limit = 10, page = 1, category = "all", sort = undefined  } = req.query;
            const user = req.session.user;
            try {
                const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await this.productsManager.getallProducts(limit, page, category, sort);
                res.render("home", { products : docs, hasPrevPage, hasNextPage, nextPage, prevPage, page, limit, category, sort, user });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.get(`${this.path}/cart/:cid`, async (req, res) => {
            try {
                const { cid } = req.params;
                const cartProducts = await this.cartManager.getProductsCart(cid);
                if (cartProducts === "Cart does not exist") {
                    return res.json({
                        message: "Cart does not exist",
                        data: cart
                    })
                }
                res.render("cart", { cartProducts, cid });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
    }
}