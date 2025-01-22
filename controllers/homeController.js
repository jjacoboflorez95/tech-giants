import customerModel from "../models/customerModel.js";
import employeeModel from "../models/employeeModel.js";
import inventoryModel from "../models/inventoryModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

class HomeController {
  static home_get = async (req, res) => {
    // getdata from product, employee, inventory,
    // customer, and order tables
    // render home page with data
    try {
      const products = await productModel.find();
      const employees = await employeeModel.find();
      const inventories = await inventoryModel.find().populate("product_id");
      const customers = await customerModel.find();
      const orders = await orderModel
        .find()
        .populate("customer_id")
        .populate("employee_id")
        .populate("product_id");
      //   console.log("employees: ", employees);
      res.render("home.ejs", {
        products: products,
        employees: employees,
        inventory: inventories,
        customers: customers,
        orders: orders,
      });
    } catch (error) {
      console.log("Error in home_get: ", error);
    }
    // res.render("home.ejs");
  };
}

export default HomeController;
