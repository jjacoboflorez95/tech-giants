import express from "express";
import router from "./routes/routes.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.listen(4545, () => {
	console.log("App is listening at port 4545 !!!");
});

app.use("/", router);
