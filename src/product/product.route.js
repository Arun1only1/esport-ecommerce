import express from "express";
import { isSeller } from "../middlewares/authentication.middleware.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import Product from "./product.model.js";
import { addProductValidationSchema } from "./product.validation.js";

const router = express.Router();

// add product
// steps:
// 1.logged in user must be seller
// 2.validate req body
// 3.create product

router.post(
  "/product/add",
  isSeller,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;

    // extract loggedInUserId
    const loggedInUserId = req.loggedInUserId;

    newProduct.sellerId = loggedInUserId;

    // create product
    await Product.create(newProduct);

    return res.status(200).send({ message: "Product is added successfully." });
  }
);

export default router;
