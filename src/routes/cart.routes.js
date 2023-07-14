import { Router } from "express";
import CartsManager from "../dao/managers/dbManagers/carts.manager.js";


export default class cartRoutes {
    path = "/carts";
    router = Router();
    cartManager = new CartsManager();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        //get products from cart
        this.router.get(`${this.path}/:cid`, async (req, res) => {
            try {
                const { cid } = req.params;
                const cartProducts = await this.cartManager.getProductsCart(cid);
                if (cartProducts === "Cart does not exist") {
                    return res.json({
                        message: "Cart does not exist",
                        data: cart
                    })
                }
                return res.json({
                    message: "Cart retrieved successfully",
                    data: cart
                })
                //res.render("cart", { cartProducts, cid });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //add cart
        this.router.post(`${this.path}`, async (req, res) => {
            try {
                const cart = req.body;
                const newCart = await this.cartManager.addCart(cart);
                return res.json({
                    message: "Cart added successfully",
                    data: newCart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //add product to cart
        this.router.post(`${this.path}/:cid/products/:pid`, async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const cart = await this.cartManager.addProductCart(cid, pid);
                if (cart === "Cart not found") {
                    return res.json({
                        message: "Cart not found",
                        data: cart
                    })
                }
                if (cart === "Product not found") {
                    return res.json({
                        message: "Product not found",
                        data: cart
                    })
                }
                return res.json({
                    message: "Product added successfully",
                    data: cart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //delete product from cart
        this.router.delete(`${this.path}/:cid/products/:pid`, async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const cart = await this.cartManager.deleteProductCart(cid, pid);
                if (cart === "Cart not found") {
                    return res.json({
                        message: "Cart not found",
                        data: cart
                    })
                }
                if (cart === "Product not found") {
                    return res.json({
                        message: "Product not found",
                        data: cart
                    })
                }
                return res.json({
                    message: "Product deleted successfully",
                    data: cart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //delete all products from cart
        this.router.delete(`${this.path}/:cid`, async (req, res) => {
            try {
                const { cid } = req.params;
                const cart = await this.cartManager.deleteProductsCart(cid);
                if (cart === "Cart not found") {
                    return res.json({
                        message: "Cart not found",
                        data: cart
                    })
                }
                return res.json({
                    message: "Cart products deleted successfully",
                    data: cart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //update quantity product from cart
        this.router.put(`${this.path}/:cid/products/:pid`, async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const { quantity } = req.body;
                const cart = await this.cartManager.updateProductCart(cid, pid, quantity);
                if (cart === "Cart not found") {
                    return res.json({
                        message: "Cart not found",
                        data: cart
                    })
                }
                if (cart === "Product not found") {
                    return res.json({
                        message: "Product not found",
                        data: cart
                    })
                }
                return res.json({
                    message: "Product quantity updated successfully",
                    data: cart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        //update products from cart
        this.router.put(`${this.path}/:cid`, async (req, res) => {
            try {
                const { cid } = req.params;
                const products = req.body;
                const cart = await this.cartManager.updateProductsCart(cid, products);
                if (cart === "Cart not found") {
                    return res.json({
                        message: "Cart not found",
                        data: cart
                    })
                }
                if (cart === "Product not found") {
                    return res.json({
                        message: "Some of the products are not found",
                        data: cart
                    })
                }
                return res.json({
                    message: "Cart updated successfully",
                    data: cart
                })
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        } ); 
    }
}