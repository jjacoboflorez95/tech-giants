import customerModel from "../models/customerModel.js";

class UpdateController {
	static update_get = (req, res) => {
		res.render("update.ejs", {
			customerUpdated: false,
			emptySearch: false,
			customerFound: false,
			formAction: "/update_search",
		});
	};

	static update_search_post = async (req, res) => {
		try {
			const form_data = req.body;

			const customer_from_db = await customerModel.findOne({
				identification: form_data.identification,
			});

			if (!customer_from_db) {
				res.render("update.ejs", {
					customerUpdated: false,
					emptySearch: true,
					customerFound: false,
					formAction: "/update_search",
					data: customer_from_db,
				});
			} else {
				res.render("update.ejs", {
					customerUpdated: false,
					emptySearch: false,
					customerFound: true,
					formAction: "/update_found",
					data: customer_from_db,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	static update_found_post = async (req, res) => {
		try {
			const form_data = req.body;

			await customerModel.updateOne(
				{ _id: form_data.id_customer },
				{
					$set: {
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
					},
				}
			);

			const customer_from_db = await customerModel.findOne({
				identification: form_data.identification,
			});

			res.render("update.ejs", {
				customerUpdated: true,
				emptySearch: false,
				customerFound: true,
				formAction: "/update_found",
				data: customer_from_db,
			});

			res.redirect("/update");
		} catch (error) {
			console.log(error);
		}
	};
}

export default UpdateController;
