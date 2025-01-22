import mongoose from "mongoose";

const productSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		category: { type: String, required: true },
		price: { type: Number, required: true },
	},
	{ collection: "product" }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
