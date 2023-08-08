import CartModel from "./models/cart.model.js";
import ProductModel from "./models/product.model.js";

export default class CartManager {
  constructor() {}

  /**
   * Adds an empty new cart to db.
   * @returns cart id
   */
  addCart = async () => {
    try {
      const newCart = {
        products: [],
      };
      const result = await CartModel.create(newCart);
      return { status: "success", payload: { cart: result } };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * @param {string} id
   * @returns an object with the requested cart
   */
  getCart = async (id) => {
    try {
      const cart = await CartModel.findById(id);
      return cart
        ? { status: "success", payload: cart }
        : { status: "error", error: "not found" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   * Adds a product to the specified cart
   * @param {string} cid
   * @param {string} pid
   * @param {string} qty
   */
  addProductToCart = async (cid, pid, qty = 1) => {
    try {
      const product = await ProductModel.findById(pid);
      if (product) {
        qty = Number(qty);
        const cart = await CartModel.findById(cid);
        if (cart) {
          let _payload = {};
          const pIdx = cart.products.findIndex(
            (_product) => _product.product == pid
          );
          if (pIdx != -1) {
            cart.products[pIdx].quantity += qty;
            _payload = cart.products[pIdx];
          } else {
            const newProduct = { product: pid, quantity: qty };
            cart.products.push(newProduct);
            _payload = newProduct;
          }
          await cart.save();
          return { status: "success", payload: _payload };
        } else {
          return { status: "error", error: "cart not found" };
        }
      } else {
        return { status: "error", error: "invalid product" };
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   *  Deletes the specified cart.
   * @param {string} id
   */
  deleteCart = async (id) => {
    try {
      await CartModel.findByIdAndDelete(id);
      return { status: "success" };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  /**
   *  Deletes the specified product from cart.
   * @param {string} cid
   * @param {string} pid
   */
  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await CartModel.findById(cid);
      if (cart) {
        const pIdx = cart.products.findIndex(
          (_product) => _product.product == pid
        );
        cart.products.splice(pIdx, 1);
        await cart.save();
        return { status: "success" };
      } else {
        return { status: "error", error: "cart not found" };
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
}
