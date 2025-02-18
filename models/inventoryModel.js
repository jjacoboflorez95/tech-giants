import mongoose from "mongoose";

const invetorySchema = mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { collection: "inventory" }
);

const inventoryModel = mongoose.model("inventory", invetorySchema);

export default inventoryModel;
