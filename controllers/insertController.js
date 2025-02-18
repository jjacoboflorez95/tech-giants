import customerModel from "../models/customerModel.js";
import employeeModel from "../models/employeeModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

class InsertController {
	static insert_get = async (req, res) => {
		const product_from_db = await productModel.find({});
		res.render("insert.ejs", {
			product: product_from_db,
			error: false,
			spanMessage: false,
			spanMessage: "",
			data: null,
		});
	};

	static insert_post = async (req, res) => {
		try {
			let customer_id;
			let total_price;
			const form_data = req.body;

			// We get the products from db
			const products_from_db = await productModel.find({});

			// Calculation of the current date
			const current_date = new Date();
			let year = current_date.getFullYear();
			let month = (current_date.getMonth() + 1).toString().padStart(2, "0");
			let day = current_date.getDate().toString().padStart(2, "0");
			const date = year + "-" + month + "-" + day;

			// Get one employee from db
			const employee_from_db = await employeeModel.find().limit(1);

			// Get the product choosen and calculate the total price
			const product_from_db = await productModel.findOne({
				_id: form_data.product,
			});

			if (isNaN(form_data.quantity) || form_data.quantity == "") {
				return res.render("insert.ejs", {
					product: products_from_db,
					error: true,
					spanMessage: true,
					message: "Quantity must be a number.",
					data: form_data,
				});
			}

			total_price =
				parseInt(product_from_db.price) * parseInt(form_data.quantity);

			// Validate if the user exists or no.
			const customer_from_db = await customerModel.findOne({
				identification: form_data.identification,
			});

			if (!customer_from_db) {
				// Insert in customer collection
				const customer_to_save = new customerModel({
					identification: form_data.identification,
					first_name: form_data.first_name,
					middle_name: form_data.middle_name,
					last_name: form_data.last_name,
					address: {
						address: form_data.address,
						city: form_data.city,
						province: form_data.province,
						country: form_data.country,
						zip_code: form_data.zip_code,
					},
					dob: form_data.dob,
					email: form_data.email,
					phone: form_data.phone,
				});
				const customer_saved_in_db = await customer_to_save.save();
				customer_id = customer_saved_in_db._id;
			} else {
				customer_id = customer_from_db._id;
			}

			// Insert in order collection
			const order_to_save = new orderModel({
				date: date,
				quantity: form_data.quantity,
				total_price: total_price,
				customer_id: customer_id,
				employee_id: employee_from_db[0]._id,
				product_id: product_from_db._id,
			});

			const order_saved_in_db = await order_to_save.save();
			//res.redirect("/insert");
			res.render("insert.ejs", {
				product: products_from_db,
				error: false,
				spanMessage: true,
				message: "Order created successfully.",
				data: null,
			});
		} catch (error) {
			console.log(error);
		}
	};
}

export default InsertController;
