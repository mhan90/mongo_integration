import mongoose from "mongoose";

const schema = new mongoose.Schema({
  products: {
    type: [
      {
        product: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    required: true,
  },
});

const CartModel = mongoose.model("carts", schema);

export default CartModel;
