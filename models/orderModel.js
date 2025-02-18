import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    date: { type: String, required: true },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
    status: { type: Number, required: true, default: 0 },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { collection: "order" }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
