import express from "express";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middlewares/authentication.middleware.js";
import validateIdFromReqParams from "../middlewares/validate.id.middleware.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import Product from "./product.model.js";
import {
  addProductValidationSchema,
  paginationValidationSchema,
} from "./product.validation.js";

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

// get product details
router.get(
  "/product/details/:id",
  isUser,
  validateIdFromReqParams,
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // send res
    return res.status(200).send({ message: "success", productDetail: product });
  }
);

// delete a product
router.delete(
  "/product/delete/:id",
  isSeller,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check product ownership

    // to be product owner: product sellerId must be equal to logged in user id
    const sellerId = product.sellerId;

    const loggedInUserId = req.loggedInUserId;

    // const isProductOwner = String(sellerId) === String(loggedInUserId);
    // alternative code
    const isProductOwner = sellerId.equals(loggedInUserId);

    // if not product owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // delete product
    await Product.deleteOne({ _id: productId });

    // send response
    return res
      .status(200)
      .send({ message: "Product is removed successfully." });
  }
);

// edit a product
router.put(
  "/product/edit/:id",
  isSeller,
  validateIdFromReqParams,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product by id
    const product = await Product.findById(productId);

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check for product ownership
    // product's sellerId must be same with loggedInUserId
    const productOwnerId = product.sellerId;
    const loggedInUserId = req.loggedInUserId;

    const isProductOwner = productOwnerId.equals(loggedInUserId);

    // if not owner of product, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // extract newValues from req.body
    const newValues = req.body;

    // edit product
    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          ...newValues,
        },
      }
    );

    // send response
    return res
      .status(200)
      .send({ message: "Product is updated successfully." });
  }
);

// list product by buyer
router.post(
  "/product/list/buyer",
  isBuyer,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination data from req.body
    const { page, limit } = req.body;

    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: {},
      },
      {
        $skip: skip,
      },
      { $limit: limit },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          availableQuanity: 1,
          description: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).send({ message: "success", productList: products });
  }
);

// list product by seller
router.post(
  "/product/list/seller",
  isSeller,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination data from req.body
    const { page, limit } = req.body;

    // calculate skip
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: {
          sellerId: req.loggedInUserId,
        },
      },

      { $skip: skip },

      { $limit: limit },

      {
        $project: {
          sellerId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).send({ message: "success", productList: products });
  }
);
export default router;
