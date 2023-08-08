import fs from "fs";

export default class CartManager {
    /**
       * @param {string} file
       * @param {string} productsPath
       */
    constructor(file, productsPath) {
        this._path = `./db/${file}.json`;
        this._prodPath = productsPath;
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

    #getCartsFromFile = async () => {
        return JSON.parse(await fs.promises.readFile(this._path, "utf-8"));
    }

    #saveCartsToFile = async (carts) => {
        await fs.promises.writeFile(this._path, JSON.stringify(carts));
    }

    /**
     * Adds an empty new cart to file.
     * @returns cart id
     */
    addCart = async () => {
        try {
            const carts = await this.#getCartsFromFile();
            const newCart = {
                id: carts.length == 0 ? 1 : carts[carts.length - 1].id + 1,
                products: []
            };
            carts.push(newCart);
            await this.#saveCartsToFile(carts);
            return { status: "success", payload: { cid: newCart.id } };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * @param {string} id
     * @returns an object with the requested cart
     */
    getCart = async (id) => {
        try {
            const carts = await this.#getCartsFromFile();
            const cart = carts.find(cart => cart.id == id);
            return cart ? { status: "success", payload: cart } : { status: "error", error: "not found" };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * Adds a product to the specified cart
     * @param {string} cid
     * @param {string} pid
     * @param {string} qty
     */
    addProductToCart = async (cid, pid, qty = 1) => {
        try {
            const _products = JSON.parse(await fs.promises.readFile(this._prodPath, "utf-8"));
            const _product = _products.find(product => product.id == pid);
            if (_product) {
                const carts = await this.#getCartsFromFile();
                const cIdx = carts.findIndex(cart => cart.id == cid);
                let _payload = {};
                if (cIdx != -1) {
                    // qty = Number(qty);
                    const pIdx = carts[cIdx].products.findIndex(_product => _product.product == pid);
                    if (pIdx != -1) {
                        carts[cIdx].products[pIdx].quantity += qty;
                        _payload = carts[cIdx].products[pIdx];
                    } else {
                        pid = Number(pid);
                        const newProduct = { product: pid, quantity: qty }
                        carts[cIdx].products.push(newProduct);
                        _payload = newProduct;
                    }
                    await this.#saveCartsToFile(carts);
                    return { status: "success", payload: _payload };
                } else {
                    return { status: "error", error: "cart not found" }
                }
            } else {
                return { status: "error", error: "invalid product" }
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     *  Deletes the specified cart.
     * @param {string} id 
     */
    deleteCart = async (id) => {
        try {
            const carts = await this.#getCartsFromFile();
            const idx = carts.findIndex(cart => cart.id == id);
            if (idx != -1) {
                carts.splice(idx, 1);
                await this.#saveCartsToFile(carts);
                return { status: "success" };
            } else {
                return { status: "error", error: "not found" }
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     *  Deletes the specified product from cart.
     * @param {string} cid
     * @param {string} pid  
     */
    deleteProductFromCart = async (cid, pid) => {
        try {
            const carts = await this.#getCartsFromFile();
            const cIdx = carts.findIndex(cart => cart.id == cid);
            if (cIdx != -1) {
                const pIdx = carts[cIdx].products.findIndex(_product => _product.product == pid);
                carts[cIdx].products.splice(pIdx, 1);
                await this.#saveCartsToFile(carts);
                return { status: "success" };
            } else {
                return { status: "error", error: "cart not found" }
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}