import { productsModel } from '../../models/products.models.js';
import products from '../../../files/products.js';

export default class ProductsManager {
    insertionProducts = async () => {
        try {
            const result = await productsModel.insertMany(products);
            return result;
        } catch (error) {
            throw new Error("Error inserting products");
        }
    }
            
    getallProducts = async (limit, page, category, sort) => {
        try {
            if (category === "all") {
                const products = await productsModel.paginate({}, { limit, page, lean : true, sort: sort && { price: sort } });
                if (products.length === 0) {
                    return ("No products found");
                }
                return products;
            }
            else {
                const products = await productsModel.paginate({category : category}, { limit, page, lean : true, sort: sort && { price: sort } })
                if (products.length === 0) {
                    return ("No products found");
                }
                return products;
            }
        } catch (error) {
            throw new Error("Error getting products");
        }
    }
    getProductsById = async (pid) => {
        try {
            const product = await productsModel.findById({_id: pid});
            if (!product) {
                return ("No product found");
            }
            return product;
        } catch (error) {
            throw new Error("Error getting product"); 
        }
    }
    addProduct = async (product) => {
        try {
            const checkProduct = await productsModel.findOne({ title: product.title });
            if (checkProduct) {
                return ("Product already exists");
            }
            const newProduct = new productsModel(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error adding product");
        }
    }
    updateProduct = async (idUpdate, product) => {
        try {
            const updateProduct = await productsModel.updateOne({ _id: idUpdate }, product);
            return updateProduct;
        } catch (error) {
            throw new Error("Error updating product");
        }
    }
    deleteProduct = async (pid) => {
        try {
            const deleteProduct = await productsModel.deleteOne({ _id: pid });
            return deleteProduct;
        } catch (error) {
            throw new Error("Error deleting product");
        }
    }

}