import * as express from "express";
import * as core from "express-serve-static-core";
import { ProductModel } from "../model/product";
import wrapAsync from "../util/wrapAsync";

const productRoute: core.Router = express.Router();

/**
 *  function to get products
 */
productRoute.get("/", wrapAsync(async (req: core.Request, res: core.Response) => {
  const { page, limit } = req.query;

  const products = await ProductModel.paginate({},
    {page, limit});
  res.send(products);
}));

/**
 * Create a new product, base on the following schema:
 * {
 *
 * }
 */
productRoute.post("/", wrapAsync(async (req: core.Request, res: core.Response) => {
    const product = req.body;
    const productInserted = await new ProductModel(product).save();
    res.status(200);
    res.send(productInserted);
}));

/**
 *  Update an product by a given product identifier:
 */
productRoute.put("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const {_id} = req.params;
  const productUpdated = await ProductModel.findOneAndUpdate({_id},  req.body, { new: true } );
  res.status(200);
  res.send(productUpdated);
}));

/**
 *  Delete product by a given product identifier
 */
productRoute.delete("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const { _id } = req.params;
  await ProductModel.findOneAndRemove({ _id });
  res.status(201);
  res.send();
}));

export default productRoute;
