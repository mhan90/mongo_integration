import fs from "fs";

export default class ProductManager {
    /**
     * String with file name.
     * @param {string} file name
     */
    constructor(file) {
        this._path = `./db/${file}.json`;
        fs.writeFile(this._path, JSON.stringify([]), { flag: "wx" }, (error) => {
            if (error) {
                console.log(`Opening file ${this._path}.`);
            } else {
                console.log(`Creating a new file at ${this._path}.`);
            }
        });
    }

    /**
     * @param {string} path
     */
    set path(path) {
        this._path = path;
    }

    #getProductsFromFile = async () => {
        return JSON.parse(await fs.promises.readFile(this._path, "utf-8"));
    }

    #saveProductsToFile = async (products) => {
        await fs.promises.writeFile(this._path, JSON.stringify(products));
    }

    /**
     * Adds a new product to file.
     * @param { { title: string, description: string, price: number, thumbnails: array , code: string, stock: number, category: string, status: boolean  } } param0 
     */
    addProduct = async ({ title, description, price, thumbnails = [], code, stock, category, status = "true" }) => {
        try {
            const products = await this.#getProductsFromFile();
            if (!products.find(product => product.code == code)) {
                const newProduct = {
                    id: products.length == 0 ? 1 : products[products.length - 1].id + 1,
                    title,
                    description,
                    price: Number(price),
                    thumbnails,
                    code,
                    stock: Number(stock),
                    category,
                    status: (status.toLowerCase() === "true") //parse to boolean
                };

                products.push(newProduct);
                await this.#saveProductsToFile(products);
                return { status: "success", payload: { product: newProduct } };
            } else {
                return { status: "error", error: `product with code ${code} already exists` };
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * @returns an array of objects with all products.
     */
    getProducts = async () => {
        try {
            return await this.#getProductsFromFile();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * 
     * @param {string} id 
     * @returns an object with the requested product details.
     */
    getProductById = async (id) => {
        try {
            const products = await this.#getProductsFromFile();
            const product = products.find(product => product.id == id);
            return product ? { status: "success", payload: product } : { status: "error", error: "not found" };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Updates the details of the specified product.
     * @param {number} id
     * @param { { title: string, description: string, price: number, thumbnails: array, code: string, stock: number, category: string, status: boolean } } data
     */
    updateProduct = async (id, data) => {
        try {
            const products = await this.#getProductsFromFile();
            const idx = products.findIndex(product => product.id == id);
            if (idx != -1) {
                if (data.price) data.price = Number(data.price);
                if (data.stock) data.stock = Number(data.stock);
                if (data.status) data.status = (data.status.toLowerCase() === "true");
                products[idx] = { ...products[idx], ...data }
                await this.#saveProductsToFile(products);
                return { status: "sucess" }
            } else {
                return { status: "error", error: `not found` }
            }
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    /**
     * Deletes the specified product.
     * @param {number} id 
     */
    deleteProduct = async (id) => {
        try {
            const products = await this.#getProductsFromFile();
            // const newProducts = products.filter(product => product.id != id);
            // await this.#saveProductsToFile(newProducts);
            const idx = products.findIndex(product => product.id == id);
            if (idx != -1) {
                products.splice(idx, 1);
                await this.#saveProductsToFile(products);
                return { status: "success" };
            } else {
                return { status: "error", error: "not found" }
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}