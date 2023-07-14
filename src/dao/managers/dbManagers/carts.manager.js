import { cartModel } from "../../models/cart.models.js";
import { productsModel } from "../../models/products.models.js";

export default class CartsManager {
    addCart = async () => {
        const cart = {
            products: []
        }
        const newCart = await cartModel.create(cart);
        return newCart;
    }
    getProductsCart = async (id) => {
        const cart = await cartModel.findById(id).populate("products.product");
        if (!cart) {
            return "Cart does not exist";
        }
        return cart.products;
    }
    addProductCart = async (cid, pid) => {
        const cart = await cartModel.findById(cid);
        const product = await productsModel.findById({ _id: pid });

        if (!cart) {
            return "Cart not found";
        }
        if (!product) {
            return "Product not found";
        }
        if (cart.products.length === 0) {
            cart.products.push({product: pid, quantity: 1});
            await cart.save();
            return cart;
        }
        if (cart.products.length > 0) {
            for (let obj in cart.products) {
                if (cart.products[obj].product == pid) {
                    cart.products[obj].quantity += 1;
                    await cart.save();
                    return cart;
                }
            }
        }
        cart.products.push({product: pid, quantity: 1});
        await cart.save(); 
        return cart;
    }
    deleteProductCart = async (cid, pid) => {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return "Cart not found";
        }
        for (let obj in cart.products) {
            if (cart.products[obj].product == pid) {
                cart.products.splice(obj, 1);
                await cart.save();
                return cart;
            }
        }
        return "Product not found";
    }
    // deleteCart = async (id) => {
    //     const cart = await cartModel.findById(id);
    //     if (!cart) {
    //         return "Cart not found";
    //     }
    //     await cart.deleteOne();
    //     return "Cart deleted";
    // }
    deleteProductsCart = async (id) => {
        const cart = await cartModel.findById(id);
        if (!cart) {
            return "Cart not found";
        }
        cart.products = [];
        await cart.save();
        return cart;
    }

    updateProductCart = async (cid, pid, quantity) => {
        const cart = await cartModel.findById(cid);
        const product = await productsModel.findById(pid);
        if (!cart) {
            return "Cart not found";
        }
        if (!product) {
            return "Product not found";
        }
        for (let obj in cart.products) {
            if (cart.products[obj].product == pid) {
                cart.products[obj].quantity = quantity;
                await cart.save();
                return cart;
            }
        }
        return "Product not found";
    }
    updateProductsCart = async (id, products) => {
        const cart = await cartModel.findById(id);
        if (!cart) {
            return "Cart not found";
        }
        for (let obj in products) {
            const productInList = await productsModel.findById(products[obj].product);
            if (!productInList) {
                return "Product not found";
            }
        }
        cart.products = products;
        await cart.save();
        return cart;
    }
}


