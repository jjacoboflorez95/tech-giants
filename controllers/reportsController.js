import orderModel from "../models/orderModel.js";
import customerModel from "../models/customerModel.js";
import inventoryModel from "../models/inventoryModel.js";
import mongoose from "mongoose";
import pdfkit from "pdfkit";
const ObjectId = mongoose.Types.ObjectId;
const months = [
  { month: "January", value: "1" },
  { month: "February", value: "2" },
  { month: "March", value: "3" },
  { month: "April", value: "4" },
  { month: "May", value: "5" },
  { month: "June", value: "6" },
  { month: "July", value: "7" },
  { month: "August", value: "8" },
  { month: "September", value: "9" },
  { month: "October", value: "10" },
  { month: "November", value: "11" },
  { month: "December", value: "12" },
];
class ReportsController {
  static reports_get = async (req, res) => {
    const customers = await customerModel.find();
    res.render("reports.ejs", {
      all_customers: customers,
      customer: null,
      orders: null,
      error: null,
    });
    // const inventory_id = "57d28452ed5d4d54e868703e";
    // // // ----------
    // const product_id = "57d28452ed5d4d54e868703e";
    // // // ----------
    // const customerId = "57d28452ed5d4d54e868701a";

    // try {
    //   const customer = await customerModel.findById(customerId);
    //   const inv_to_update = await orderModel.findById(inventory_id);
    //   if (inv_to_update) {
    //     console.log(`inv_to_update: ${inv_to_update}`);
    //     const updated_inventory = await orderModel.findOneAndUpdate(
    //       { _id: inventory_id },
    //       {
    //         $set: {
    //           product_id: new ObjectId(product_id),
    //         },
    //       }
    //     );
    //     console.log(`updated order: ${updated_inventory}`);
    //     res.render("reports.ejs", { customer: customer });
    //   }
    //   res.render("reports.ejs", { customer: customer });
    // } catch (error) {
    //   console.log("!!!!!!!!!!Error in reports_get!!!!!!!!!!: ", error);
    // }

    // const customerId = "57d28452ed5d4d54e868701a";

    // // get customer object from table
    // try {
    //   const customer = await customerModel.findById(customerId);
    //   const orders = await orderModel
    //     .find({ customer_id: customerId })
    //     .populate("product_id");
    //   if (orders) {
    //     console.log("*********Orders found for customer*********");
    //     // console.log(`orders: ${orders}\n orders length: ${orders.length}`);
    //     res.render("reports.ejs", { customer: customer, orders: orders });
    //   } else {
    //     console.log("*********No orders found for customer*********");
    //   }
    // } catch (error) {
    //   console.log("!!!!!!!!!!Error in reports_get!!!!!!!!!!: ", error);
    // }
  };

  static get_monthly_report_get = async (req, res) => {
    res.render("monthly_report.ejs", {
      months: months,
      error: null,
      monthly_orders: null,
      selected_month: null,
    });
  };

  static get_monthly_report_post = async (req, res) => {
    const form_data = req.body;
    const selected_month = form_data.month;
    let date = new Date(`2023-${selected_month}-01`);
    const monthly_orders = await orderModel
      .find()
      .populate("product_id")
      .populate("customer_id")
      .populate("employee_id");
    let orders = [];
    monthly_orders.forEach((order_item) => {
      const order_date = new Date(order_item.date);
      if (order_date.getMonth() != date.getMonth()) {
      } else {
        // console.log(`match found for ${order_item.date}`);
        orders.push(order_item);
      }
    });

    if (orders && orders.length > 0) {
      // console.log(
      //   `---------------orders for ${
      //     months[date.getMonth() + 1].month
      //   }: ${orders}`
      // );
      res.render("monthly_report.ejs", {
        monthly_orders: orders,
        months: months,
        error: null,
        selected_month: months[date.getMonth()],
      });
    } else {
      // console.log(
      //   `!!!!!!! No orders found for ${
      //     months[date.getMonth(date)].month
      //   }/2023 !!!!!!!`
      // );
      res.render("monthly_report.ejs", {
        error: `No orders found for ${
          months[date.getMonth(date)].month
        } / 2023`,
        months: months,
        monthly_orders: null,
        selected_month: null,
      });
    }
  };

  static print_monthly_report = async (req, res) => {
    const form_data = req.body;
    const selected_month = form_data.selected_month;
    let date = new Date(`2023-${selected_month}-01`);
    const monthly_orders = await orderModel
      .find()
      .populate("product_id")
      .populate("customer_id")
      .populate("employee_id");
    let orders = [];
    monthly_orders.forEach((order_item) => {
      const order_date = new Date(order_item.date);
      if (order_date.getMonth() != date.getMonth()) {
      } else {
        orders.push(order_item);
      }
    });
    // console.log(
    //   `MONTHLY ORDERS for ${months[date.getMonth()].month}: ${orders}`
    // );
    if (orders && orders.length > 0) {
      // generate pdf using pdfkit
      const doc = new pdfkit();
      doc.pipe(res);
      // Set font and font size
      doc.font("Helvetica");
      doc.fontSize(12);

      // Title at the center top of the page
      doc
        .fontSize(20)
        .text(
          `MONTHLY REPORT FOR ${months[
            date.getMonth(date)
          ].month.toUpperCase()}`,
          {
            align: "center",
          }
        );
      // Company logo
      const imagePath = "./public/images/circuit.png";
      const imageWidth = 60;
      const imageHeight = 60;
      const imageX = doc.page.width - imageWidth - 50;
      const imageY = 50;

      doc.image(imagePath, imageX, imageY, {
        width: imageWidth,
        height: imageHeight,
      });
      // Company address
      doc.fontSize(12).text("Tech Giants");
      doc.text("123 King St");
      doc.text("Waterloo, ON, Canada");
      doc.text("M1M 1M1");
      // create space between company address and customer address
      doc.moveDown();

      // Draw table header with borders
      const tableX = 20;
      const tableY = 200;
      const tableWidth = 540;
      const columnWidths = [80, 100, 120, 120, 120];

      doc.lineWidth(1);
      doc.rect(tableX, tableY, tableWidth, 20).stroke();
      let xPos = tableX;

      // Draw vertical lines for each column
      for (const width of columnWidths) {
        doc.moveTo(xPos + width, tableY);
        doc.lineTo(xPos + width, tableY + 20);
        doc.stroke();
        xPos += width;
      }

      doc.text("Date", tableX + 5, tableY + 7);
      doc.text("Customer Name", tableX + 90, tableY + 7);
      doc.text("Employee Name", tableX + 190, tableY + 7);
      doc.text("Product Name", tableX + 310, tableY + 7);
      doc.text("Total Price", tableX + 440, tableY + 7);
      // doc.text("Total Price", tableX + 540, tableY + 7);

      let yPos = tableY + 20;
      for (const order of orders) {
        doc.rect(tableX, yPos, tableWidth, 20).stroke();
        xPos = tableX;
        for (const width of columnWidths) {
          doc.moveTo(xPos + width, yPos);
          doc.lineTo(xPos + width, yPos + 20);
          doc.stroke();
          xPos += width;
        }
        doc.text(order.date, tableX + 10, yPos + 7);
        doc.text(
          order.customer_id.first_name + " " + order.customer_id.last_name,
          tableX + 90,
          yPos + 7
        );
        doc.text(
          order.employee_id.first_name + " " + order.employee_id.last_name,
          tableX + 190,
          yPos + 7
        );
        doc.text(order.product_id.name, tableX + 310, yPos + 7);
        doc.text(order.total_price, tableX + 440, yPos + 7);
        // doc.text(order.total_price, tableX + 540, yPos + 7);
        yPos += 20;
      }
      doc.moveDown();
      // Calculate sum of total prices
      const totalCost = orders.reduce(
        (sum, order) => sum + order.total_price,
        0
      );
      doc.text(`Total Cost: $${totalCost.toFixed(2)}`, { align: "right" });

      // Footer
      doc
        .fontSize(10)
        .text(
          "Derryck - 8862396 || Jacobo - 8857381",
          50,
          doc.page.height - 95,
          {
            align: "center",
          }
        );
      doc.end();
    }
  };

  static get_customer_orders = async (req, res) => {
    try {
      const form_data = req.body;
      const customerId = form_data.customer_id;
      const all_customers = await customerModel.find();
      const customer = await customerModel.findById(customerId);
      const orders = await orderModel
        .find({ customer_id: customerId })
        .populate("product_id");
      if (orders && orders.length > 0) {
        // console.log("********* Orders found for customer ***");
        res.render("reports.ejs", {
          all_customers: all_customers,
          customer: customer,
          orders: orders,
          error: null,
        });
      } else {
        console.log("*********No orders found for customer*********");
        res.render("reports.ejs", {
          all_customers: all_customers,
          customer: customer,
          orders: null,
          error: `No orders found for ${customer.first_name} ${customer.last_name}`,
        });
      }
    } catch (error) {
      console.log("Unable to fetch customer orders: ", error);
    }
  };

  static print_order_report = async (req, res) => {
    const form_data = req.body;
    const customerId = form_data.customer_id;
    const customer = await customerModel.findById(customerId);
    const orders = await orderModel
      .find({ customer_id: customerId })
      .populate("product_id");
    // console.log(`orders: ${orders}`);
    // generate pdf using pdfkit
    const doc = new pdfkit();
    doc.pipe(res);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    // Company logo
    const imagePath = "./public/images/circuit.png";
    const imageWidth = 60;
    const imageHeight = 60;
    const imageX = doc.page.width - imageWidth - 50;
    const imageY = 50;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight,
    });

    // doc.circle(500, 50, 30).fill("#007bff");
    doc.fillColor("black");
    // Company address
    doc.fontSize(12).text("Tech Giants");
    doc.text("123 King St");
    doc.text("Waterloo, ON, Canada");
    doc.text("M1M 1M1");
    // create space between company address and customer address
    doc.moveDown();

    // Customer's name and address
    doc.text("Billed to:");
    doc.text(
      customer.first_name +
        " " +
        customer.middle_name +
        " " +
        customer.last_name
    );
    doc.text(customer.address.address);
    doc.text(customer.address.city + ", " + customer.address.province);
    doc.text(customer.address.country + ", " + customer.address.zip_code);
    doc.moveDown();
    // Draw table header with borders
    const tableX = 50;
    const tableY = 250;
    const tableWidth = 500;
    const columnWidths = [180, 100, 100, 200];

    doc.lineWidth(1);
    doc.rect(tableX, tableY, tableWidth, 20).stroke();
    let xPos = tableX;

    // Draw vertical lines for each column
    for (const width of columnWidths) {
      doc.moveTo(xPos + width, tableY);
      doc.lineTo(xPos + width, tableY + 20);
      doc.stroke();
      xPos += width;
    }
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.text("Product Name", tableX + 10, tableY + 7);
    doc.text("Unit Price", tableX + 190, tableY + 7);
    doc.text("Quantity", tableX + 290, tableY + 7);
    doc.text("Total Price", tableX + 390, tableY + 7);
    let yPos = tableY + 20;
    for (const order of orders) {
      doc.rect(tableX, yPos, tableWidth, 20).stroke();
      xPos = tableX;
      for (const width of columnWidths) {
        doc.moveTo(xPos + width, yPos);
        doc.lineTo(xPos + width, yPos + 20);
        doc.stroke();
        xPos += width;
      }
      doc.text(order.product_id.name, tableX + 10, yPos + 7);
      doc.text(order.product_id.price.toString(), tableX + 190, yPos + 7);
      doc.text(order.quantity, tableX + 290, yPos + 7);
      doc.text(order.total_price, tableX + 390, yPos + 7);
      yPos += 20;
    }
    doc.moveDown();

    // Calculate sum of total prices
    const totalCost = orders.reduce((sum, order) => sum + order.total_price, 0);
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`, { align: "right" });

    // Footer
    doc
      .fontSize(10)
      .text("Derryck - 8862396 || Jacobo - 8857381", 50, doc.page.height - 95, {
        align: "center",
      });
    doc.end();
  };
}

export default ReportsController;
