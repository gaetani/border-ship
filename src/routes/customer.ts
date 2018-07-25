import { ObjectId } from "bson";
import * as express from "express";
import * as core from "express-serve-static-core";
import * as mongoose from "mongoose";
import { CustomerModel } from "../model/customer";
import { OrderModel } from "../model/order";
import { ProductModel } from "../model/product";
import wrapAsync from "../util/wrapAsync";

const customerRoute: core.Router = express.Router();

/**
 *  Get the amount of money paid by a customer
 */
customerRoute.get("/:_id/orders/amount", async (req: core.Request, res: core.Response) => {
  const { _id } = req.params;
  const orders = await CustomerModel.aggregate([
    {
      $match: { _id },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "customer",
        as: "orders",
      },
    },
    { $unwind: "$orders" },
    {
      $lookup: {
        from: "products",
        localField: "orders.items",
        foreignField: "_id",
        as: "items",
      },
    },
    { $unwind: "$items" },

    { $group: {
        _id: { id: "$_id", address: "$address", birth: "$birth", city: "$city", country: "$country",
          email: "$email", name: "$name", title: "$title", currency: "$items.currency" },
        amount: { $sum: "$items.price" },
      },
    },
    { $project: {
        _id: 0,
        address: "$_id.address",
        birth: "$_id.birth",
        city: "$_id.city",
        country: "$_id.country",
        email: "$_id.email",
        name: "$_id.name",
        title: "$_id.title",
        currency: "$_id.currency",
        amount: "$amount",
      },
    },
  ]);
  res.status(200);
  res.send(orders);
});

/**
 *  Get all customers that bought a certain item
 */
customerRoute.get("/orders/item", async (req: core.Request, res: core.Response) => {
  const { name, page, limit } = req.query;
  const product = await ProductModel.findOne({item: name});
  const customerIds = await OrderModel.distinct("customer", { items: product._id });
  const customers = await CustomerModel.paginate({ _id: { $in: customerIds } }, { page, limit: +limit});
  res.status(200);
  res.send(customers);
});

/**
 *  Get all order bought by a customer
 */
customerRoute.get("/orders", async (req: core.Request, res: core.Response) => {
  const orders = await CustomerModel.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "customer",
        as: "orders",
      },
    },
  ]);
  res.status(200);
  res.send(orders);
});

/**
 * Get customer info
 */
customerRoute.get("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
    const { _id } = req.params;
    const customer = await CustomerModel.findById({_id});
    res.send(customer);
}));

/**
 * Create a new customer, base on the following schema:
 * {
 *
 * }
 */
customerRoute.post("/", wrapAsync(async (req: core.Request, res: core.Response) => {
    const customer = req.body;

    const customerInserted = await new CustomerModel(customer).save();
    res.status(200);
    res.send(customerInserted);
}));

/**
 *  Update customer info:
 */
customerRoute.put("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const {_id} = req.params;
  const customerUpdated = await CustomerModel.findOneAndUpdate({ _id },  req.body , { new: true });
  res.status(200);
  res.send(customerUpdated);
}));

/**
 *  Delete customer info
 */
customerRoute.delete("/:_id", wrapAsync(async (req: core.Request, res: core.Response) => {
  const { _id } = req.params;
  const removedCustomer = await CustomerModel.findOneAndRemove({ _id });
  res.status(200);
  res.send(removedCustomer);
}));

export default customerRoute;
