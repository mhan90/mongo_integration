import { Router } from "express";
import { uploader } from "../config/multer.js"
import ProductManager from "../ProductManager.js";
const mainRouter = Router();
const pManager = new ProductManager("products");

mainRouter.get("/", async (req, res) => {
    try {
        const _products = await pManager.getProducts();
        res.render("home", { title: "Products list", products: _products });
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
});

mainRouter.get("/realTimeProducts", async (req, res) => {
    try {
        const _products = await pManager.getProducts();
        res.render("realTimeProducts", { title: "Live Products list", products: _products });
    } catch (e) {
        res.status(500).send({ status: "error", error: e });
    }
});

mainRouter.post("/realTimeProducts", uploader.array("thumbnails"), async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            res.status(400).send({ status: "error", error: "missing data" });
        } else {
            if (req.files) {
                product.thumbnails = [];
                req.files.forEach(file => product.thumbnails.push(file.path));
            }
            const result = await pManager.addProduct(product);
            req.io.emit("newProduct", result.payload.product);
            res.sendStatus(200);
        }
    } catch (e) {
        res.status(500).send({ status: "error while adding new product", error: e });
    }
});

mainRouter.delete("/realTimeProducts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        res.send(await pManager.deleteProduct(id));
        req.io.emit("deleteProduct", id);
    } catch (e) {
        res.status(500).send({ status: "error", error: e })
    }
});


export default mainRouter;
