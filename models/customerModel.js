import mongoose from "mongoose";
import {} from "dotenv/config";

const uri = process.env.MONGO_URI;

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Mongodb connected successfully !!!");
	})
	.catch((error) => {
		console.log(`Not Connected to mongo db due to the error below \n ${error}`);
	});

const customerSchema = mongoose.Schema(
	{
		identification: { type: String, required: true },
		first_name: { type: String, required: true },
		middle_name: { type: String },
		last_name: { type: String, required: true },
		address: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			province: { type: String, required: true },
			country: { type: String, required: true },
			zip_code: { type: String, required: true },
		},
		dob: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: Number, required: true },
	},
	{ collection: "customer" }
);

const customerModel = mongoose.model("customer", customerSchema);

export default customerModel;
